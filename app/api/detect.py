from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.workflow import UniversalWorkflowIR
from app.services.gemini import GeminiService


router = APIRouter(
    prefix="/api/v1",
    tags=["Workflow Detection"],
)


class DetectRequest(BaseModel):
    prompt: str


class DetectResponse(BaseModel):
    workflow: UniversalWorkflowIR
    saved: bool = False


gemini_service = GeminiService()


@router.post(
    "/detect",
    response_model=DetectResponse,
)
async def detect_workflow(
    request: DetectRequest,
):
    """
    Generate a workflow from a business requirement without authentication
    or persistence.
    """

    # --------------------------------------------------
    # Validate prompt
    # --------------------------------------------------

    if not request.prompt.strip():
        raise HTTPException(
            status_code=400,
            detail="Workflow prompt cannot be empty.",
        )

    # --------------------------------------------------
    # Generate workflow with Gemini
    # --------------------------------------------------

    try:
        workflow = await gemini_service.generate_workflow(
            request.prompt
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Workflow generation failed: {str(exc)}",
        )

    # --------------------------------------------------
    # Return workflow
    # --------------------------------------------------

    return DetectResponse(
        workflow=workflow,
        saved=False,
    )
