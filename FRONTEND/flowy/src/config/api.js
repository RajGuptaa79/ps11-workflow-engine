// Backend connection variables. Override VITE_API_BASE_URL in a frontend .env file.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const API_ENDPOINTS = Object.freeze({
  authMe: `${API_BASE_URL}/api/v1/auth/me`,
  detectWorkflow: `${API_BASE_URL}/api/v1/detect`,
  executeWorkflow: `${API_BASE_URL}/api/v1/execute`,
  executionHistory: `${API_BASE_URL}/api/v1/executions`,
  executionStream: `${API_BASE_URL}/api/v1/execute/stream`,
});
