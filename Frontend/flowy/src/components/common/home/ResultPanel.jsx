export default function ResultPanel({ isGenerated, query, workflow, error }) {
  return (
    <section
      className={`result-panel ${isGenerated ? "result-panel--visible" : ""}`}
    >
      <div className="result-panel__surface">
        <div
          className={`result-panel__content${
            workflow ? " result-panel__content--output" : ""
          }`}
        >
          {workflow ? (
            <pre className="result-panel__output">
              {JSON.stringify(workflow, null, 2)}
            </pre>
          ) : error ? (
            <p className="result-panel__placeholder">{error}</p>
          ) : (
            <p className="result-panel__placeholder">
              {query?.trim()
                ? "Structural Diagram Output Will Appear Here"
                : "Enter workflow logic to generate the structural diagram output."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
