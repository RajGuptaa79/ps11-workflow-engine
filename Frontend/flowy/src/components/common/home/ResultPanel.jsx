export default function ResultPanel({ isGenerated, query }) {
  return (
    <section
      className={`result-panel ${isGenerated ? "result-panel--visible" : ""}`}
    >
      <div className="result-panel__surface">
        <div className="result-panel__content">
          <p className="result-panel__placeholder">
            {query?.trim()
              ? "Structural Diagram Output Will Appear Here"
              : "Enter workflow logic to generate the structural diagram output."}
          </p>
        </div>
      </div>
    </section>
  );
}
