from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from app.models.workflow import UniversalWorkflowIR
from app.services.gemini import GeminiService
from app.core.firebase import verify_token
from app.repositories.workflows import create_workflow


router = APIRouter(
    prefix="/api/v1",
    tags=["Workflow Detection"],
)


class DetectRequest(BaseModel):
    prompt: str


class DetectResponse(BaseModel):
    workflow: UniversalWorkflowIR
    saved: bool = True


gemini_service = GeminiService()


@router.post(
    "/detect",
    response_model=DetectResponse,
)
async def detect_workflow(
    request: DetectRequest,
    authorization: str | None = Header(default=None),
):
    """
    Generate a workflow from a business requirement,
    authenticate the user, and save the workflow to MongoDB.
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
    # Validate Authorization header
    # --------------------------------------------------

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required.",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format.",
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1,
    ).strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is missing.",
        )

    # --------------------------------------------------
    # Verify Firebase token
    # --------------------------------------------------

    try:
        decoded_token = verify_token(token)

    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )

    user_id = decoded_token.get("uid")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
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
    # Save workflow to MongoDB
    # --------------------------------------------------

    try:
        await create_workflow(
            workflow=workflow.model_dump(),
            user_id=user_id,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Workflow generated but could not be saved: {str(exc)}",
        )

    # --------------------------------------------------
    # Return workflow
    # --------------------------------------------------

    return DetectResponse(
        workflow=workflow,
        saved=True,
    )