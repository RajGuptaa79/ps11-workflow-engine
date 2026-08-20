import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from models import UniversalWorkflowIR

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are a business workflow architect. Convert unstructured SOPs, logs, or requirements 
into an executable Directed Acyclic Graph (DAG) adhering to the Universal Workflow Definition.
- Map state using double-bracket variables: {{trigger.key}} or {{stepId.field}}.
- Ensure sequential and branching logic is properly linked via onSuccess step IDs.
- For failures, mark onFailure as 'abort' or 'skip'.
"""

def extract_workflow_ir(requirement: str, project_context: str = "") -> UniversalWorkflowIR:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Project Context: {project_context}\n\nRequirement: {requirement}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=UniversalWorkflowIR,
            temperature=0.1
        ),
    )
    return response.parsed