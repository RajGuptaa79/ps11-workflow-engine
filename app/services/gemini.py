from google import genai
from google.genai import types

from app.core.config import settings
from app.models.workflow import UniversalWorkflowIR


class GeminiService:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

        self.model = "gemini-3.6-flash"

    async def generate_workflow(
        self,
        business_prompt: str,
    ) -> UniversalWorkflowIR:

        system_prompt = """
You are the Workflow Architect for an Autonomous Business
Workflow Engine.

Convert the business requirement into an executable workflow.

The workflow describes WHAT should happen.
The backend execution engine will perform the actual actions.

Rules:

1. Break the requirement into logical executable steps.

2. Every step must have a unique ID.

3. Every step must describe what it does.

4. Use machine-readable action names.

Examples:

inventory.check
inventory.reserve
order.create
order.update
customer.notify
business.notify
email.send
database.lookup
http.request
ai.analyze

5. Identify conditional decisions.

6. Define success and failure routing.

7. Use runtime variables such as:

{{customer_name}}
{{product}}
{{quantity}}
{{order_id}}
{{email}}

8. Never invent execution results.

9. Never claim that an external system was contacted.

10. Preserve the business requirement.

11. Keep the workflow executable as a DAG.

12. Return ONLY the structured workflow.
"""

        prompt = f"""
{system_prompt}

BUSINESS REQUIREMENT:

{business_prompt}
"""

        schema = UniversalWorkflowIR.model_json_schema()

        self._remove_additional_properties(schema)

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                    temperature=0.2,
                ),
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return UniversalWorkflowIR.model_validate_json(
                response.text
            )

        except Exception as exc:

            error_text = str(exc)

            # Gemini quota / rate limit
            if (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
                or "quota" in error_text.lower()
                or "rate limit" in error_text.lower()
            ):
                raise RuntimeError(
                    "Gemini API quota exceeded. "
                    "Please wait for the quota to reset "
                    "or check your Gemini API usage and billing."
                ) from exc

            # Authentication / API key problem
            if (
                "401" in error_text
                or "403" in error_text
                or "API key" in error_text
                or "PERMISSION_DENIED" in error_text
            ):
                raise RuntimeError(
                    "Gemini API authentication failed. "
                    "Please check your GEMINI_API_KEY configuration."
                ) from exc

            # Generic Gemini error
            raise RuntimeError(
                f"Workflow generation failed: {error_text}"
            ) from exc

    @staticmethod
    def _remove_additional_properties(schema):

        if isinstance(schema, dict):

            schema.pop(
                "additionalProperties",
                None,
            )

            for value in schema.values():
                GeminiService._remove_additional_properties(
                    value
                )

        elif isinstance(schema, list):

            for item in schema:
                GeminiService._remove_additional_properties(
                    item
                )