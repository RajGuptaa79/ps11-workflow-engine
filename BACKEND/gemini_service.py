import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from models import UniversalWorkflowIR

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are a business workflow architect. Convert unstructured SOPs, logs, or requirements 
into an executable Directed Acyclic Graph (DAG) adhering strictly to this JSON format:

{
  "workflowId": "wf-unique-id",
  "workflowName": "Descriptive Workflow Name",
  "triggerEvent": {
    "type": "manual", 
    "schema": "OptionalSchema"
  },
  "steps": [
    {
      "stepId": "step-001",
      "name": "Step Name",
      "actionType": "function",
      "endpoint": null,
      "inputMapping": { "param": "{{trigger.key}}" },
      "condition": null,
      "onSuccess": ["step-002"],
      "onFailure": "abort"
    }
  ]
}

Rules:
- actionType must be one of: "function", "apiCall", "conditionalGateway", "parallelFork", "loop"
- triggerEvent.type must be one of: "formCreate", "formUpdate", "webhook", "schedule", "manual"
- onFailure must be either "abort" or "skip"
- Map state using double-bracket variables: {{trigger.key}} or {{stepId.field}}
- Always return valid, raw JSON matching the structure above.
"""

def extract_workflow_ir(requirement: str, project_context: str = "") -> UniversalWorkflowIR:
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"Project Context: {project_context}\n\nRequirement: {requirement}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0.1
        ),
    )
    
    # Clean and validate through Pydantic
    raw_text = response.text.strip()
    return UniversalWorkflowIR.model_validate_json(raw_text)