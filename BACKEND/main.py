import re
import json
import uuid
import asyncio
import httpx
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from models import DetectRequest, TriggerRequest, UniversalWorkflowIR
from gemini_service import extract_workflow_ir

app = FastAPI(title="Business Workflow Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKFLOWS: dict[str, UniversalWorkflowIR] = {}
RUN_QUEUES: dict[str, asyncio.Queue] = {}

def resolve_variables(template_str: str, context: dict) -> str:
    def replacer(match):
        path = match.group(1).strip().split(".")
        val = context
        for key in path:
            if isinstance(val, dict):
                val = val.get(key, "")
            else:
                return ""
        return str(val)
    return re.sub(r"\{\{([^}]+)\}\}", replacer, template_str)

def resolve_payload(mapping: dict, context: dict) -> dict:
    resolved = {}
    for k, v in mapping.items():
        if isinstance(v, str) and "{{" in v:
            resolved[k] = resolve_variables(v, context)
        else:
            resolved[k] = v
    return resolved

async def execute_dag(run_id: str, workflow: UniversalWorkflowIR, trigger_payload: dict):
    queue = RUN_QUEUES[run_id]
    context = {"trigger": trigger_payload}
    
    async with httpx.AsyncClient() as http_client:
        for step in workflow.steps:
            await queue.put({
                "stepId": step.stepId,
                "status": "running",
                "message": f"Executing {step.name}"
            })

            resolved_inputs = resolve_payload(step.inputMapping, context)
            start_time = asyncio.get_event_loop().time()
            step_status = "success"
            response_data = {}

            try:
                if step.endpoint:
                    res = await http_client.post(step.endpoint, json=resolved_inputs, timeout=5.0)
                    response_data = res.json() if res.headers.get("content-type") == "application/json" else {"text": res.text}
                else:
                    await asyncio.sleep(0.5)
                    response_data = {"result": f"Executed {step.name}"}

                context[step.stepId] = response_data
            except Exception as e:
                step_status = "failed"
                response_data = {"error": str(e)}
                if step.onFailure == "abort":
                    duration_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
                    await queue.put({
                        "stepId": step.stepId,
                        "status": "failed",
                        "durationMs": duration_ms,
                        "output": response_data
                    })
                    break

            duration_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
            await queue.put({
                "stepId": step.stepId,
                "status": step_status,
                "durationMs": duration_ms,
                "output": response_data
            })

    await queue.put(None)

@app.post("/api/v1/detect", response_model=UniversalWorkflowIR)
async def detect_workflow(req: DetectRequest):
    try:
        workflow_ir = extract_workflow_ir(req.requirement)
        WORKFLOWS[workflow_ir.workflowId] = workflow_ir
        return workflow_ir
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/workflow/trigger")
async def trigger_workflow(req: TriggerRequest, background_tasks: BackgroundTasks):
    workflow = WORKFLOWS.get(req.workflowId)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow ID not found.")

    run_id = str(uuid.uuid4())
    RUN_QUEUES[run_id] = asyncio.Queue()
    
    background_tasks.add_task(execute_dag, run_id, workflow, req.triggerPayload)
    return {"runId": run_id, "status": "running"}

@app.get("/api/v1/workflow/stream/{run_id}")
async def stream_workflow_execution(run_id: str):
    if run_id not in RUN_QUEUES:
        raise HTTPException(status_code=404, detail="Run ID not found.")

    async def event_generator():
        queue = RUN_QUEUES[run_id]
        while True:
            data = await queue.get()
            if data is None:
                yield {"event": "end", "data": "Workflow execution finished"}
                break
            yield {"event": "step_update", "data": json.dumps(data)}

    return EventSourceResponse(event_generator())

@app.get("/")
async def root():
    return {"status": "online", "message": "Workflow Engine API is running"}