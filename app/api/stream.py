from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
import asyncio
import json

router = APIRouter(
    prefix="/api/v1",
    tags=["Workflow Stream"],
)


@router.get("/execute/stream")
async def execute_stream(
    workflow_steps: str = Query(...),
):
    async def event_generator():
        try:
            steps = json.loads(workflow_steps)

            for step in steps:
                step_id = step.get("id")

                if not step_id:
                    continue

                yield f"data: {json.dumps({
                    'step_id': step_id,
                    'status': 'running'
                })}\n\n"

                await asyncio.sleep(1)

                yield f"data: {json.dumps({
                    'step_id': step_id,
                    'status': 'success'
                })}\n\n"

            yield f"data: {json.dumps({
                'status': 'completed'
            })}\n\n"

        except Exception as exc:
            yield f"data: {json.dumps({
                'status': 'failed',
                'error': str(exc)
            })}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )