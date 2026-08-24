export default function QueryPanel({
  query,
  setQuery,
  onGenerate,
  generated,
  isAddMenuOpen,
  onAddToggle,
  onAddItemClick,
}) {
  return (
    <section
      className={`query-card ${generated ? "query-card--generated" : ""}`}
    >
      <div className="query-card__main">
        <textarea
          className="query-card__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the workflow logic in natural language. (Up to 5000 words). The engine will parse this into a structural diagram..."
        />
      </div>

      <div className="query-card__toolbar">
        <div className="query-card__toolbar-left">
          {generated ? (
            <div className="add-menu">
              <button
                type="button"
                className="panel-btn panel-btn--secondary"
                onClick={onAddToggle}
                aria-haspopup="menu"
                aria-expanded={isAddMenuOpen}
              >
                <span className="panel-btn__plus">+</span>
                <span>Add</span>
              </button>

              <div
                className={`add-menu__dropdown ${isAddMenuOpen ? "add-menu__dropdown--open" : ""}`}
              >
                <div className="add-menu__section">
                  <button
                    type="button"
                    className="add-menu__item"
                    onClick={() => onAddItemClick("Deep research")}
                  >
                    Deep research
                  </button>
                </div>

                <div className="add-menu__divider" />

                <div className="add-menu__section">
                  <button
                    type="button"
                    className="add-menu__item"
                    onClick={() => onAddItemClick("Add media")}
                  >
                    Add media
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <span className="query-card__toolbar-placeholder" />
          )}
        </div>

        <div className="query-card__toolbar-right">
          <button
            className="panel-btn panel-btn--primary"
            onClick={onGenerate}
            type="button"
          >
            <span>{generated ? "Update" : "Generate"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
