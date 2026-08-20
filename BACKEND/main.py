import re
import json
import uuid
import asyncio
import httpx
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from models import DetectRequest, TriggerRequest, UniversalWorkflowIR
from gemini_service import extract_workflow_ir

# --- 1. Scheduler & Lifespan Setup ---
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the continuous loop when the server boots
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(title="Autonomous Business Workflow Engine", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. State Management ---
WORKFLOWS: dict[str, UniversalWorkflowIR] = {}
RUN_QUEUES: dict[str, asyncio.Queue] = {}

# --- 3. Execution Helpers ---
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

def evaluate_condition(condition, context: dict) -> bool:
    if not condition:
        return True
    
    field_expr = condition.field
    if "{{" in field_expr:
        field_expr = resolve_variables(field_expr, context)
    
    actual = field_expr
    expected = condition.value

    if condition.operator == "eq":
        return str(actual) == str(expected)
    if condition.operator == "neq":
        return str(actual) != str(expected)
    if condition.operator == "contains":
        return str(expected) in str(actual)
    if condition.operator in ["gt", "lt"]:
        try:
            num_actual = float(actual)
            num_expected = float(expected)
            return num_actual > num_expected if condition.operator == "gt" else num_actual < num_expected
        except ValueError:
            return False
    return True

async def execute_dag(run_id: str, workflow: UniversalWorkflowIR, trigger_payload: dict):
    queue = RUN_QUEUES[run_id]
    context = {"trigger": trigger_payload}
    steps_dict = {s.stepId: s for s in workflow.steps}
    
    current_step_id = workflow.steps[0].stepId if workflow.steps else None

    while current_step_id:
        step = steps_dict.get(current_step_id)
        if not step:
            break

        # Check conditional gate
        if not evaluate_condition(step.condition, context):
            await queue.put({
                "stepId": step.stepId,
                "status": "skipped",
                "reason": "Condition evaluated to false"
            })
            current_step_id = step.onSuccess
            continue

        await queue.put({
            "stepId": step.stepId,
            "status": "running",
            "message": f"Executing: {step.name}"
        })

        start_time = asyncio.get_event_loop().time()
        resolved_inputs = resolve_payload(step.inputMapping, context)
        
        # Simulate / dispatch action execution
        await asyncio.sleep(0.4)
        output_data = {
            "status": "executed",
            "action": step.actionType,
            "processedInputs": resolved_inputs,
            "resultId": f"res_{uuid.uuid4().hex[:6]}"
        }
        
        duration_ms = int((asyncio.get_event_loop().time() - start_time) * 1000)
        context[step.stepId] = output_data

        await queue.put({
            "stepId": step.stepId,
            "status": "success",
            "durationMs": duration_ms,
            "output": output_data
        })

        current_step_id = step.onSuccess

    await queue.put(None)

async def scheduled_trigger(workflow_id: str):
    """Helper function for the scheduler to trigger the DAG automatically"""
    workflow = WORKFLOWS.get(workflow_id)
    if not workflow:
        return
    
    run_id = str(uuid.uuid4())
    RUN_QUEUES[run_id] = asyncio.Queue()
    # Trigger with an empty payload for automated runs
    await execute_dag(run_id, workflow, {"source": "autonomous_schedule"})

# --- 4. API Routes ---
@app.post("/api/v1/detect", response_model=UniversalWorkflowIR)
async def detect_workflow(req: DetectRequest):
    try:
        workflow_ir = extract_workflow_ir(req.requirement, req.projectName)
        WORKFLOWS[workflow_ir.workflowId] = workflow_ir
        
        # If the AI determined this is a continuous automation, loop it
        if workflow_ir.triggerEvent.type == "schedule":
            scheduler.add_job(
                scheduled_trigger,
                'interval',
                minutes=60, # Loops every 60 minutes
                args=[workflow_ir.workflowId],
                id=workflow_ir.workflowId,
                replace_existing=True
            )
            
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
                yield {"event": "end", "data": json.dumps({"status": "completed"})}
                break
            yield {"event": "step_update", "data": json.dumps(data)}

    return EventSourceResponse(event_generator())