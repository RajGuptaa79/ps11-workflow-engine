import { useState } from "react";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import "./libraryPage.css";

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LibraryPage() {
  const { entries } = useLibrary();
  const [openId, setOpenId] = useState(null);

  const toggleEntry = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="home-main library-main">
      <TopNavbar />

      <div className="home-shell">
        <SideNavbar />

        <main className="home-workspace library-workspace">
          <PolkaField />

          <section className="library-board">
            <div className="library-board__surface">
              <div className="library-board__header">
                <div>
                  <p className="library-board__eyebrow">Prompt history</p>
                  <h1 className="library-board__title">Library</h1>
                  <p className="library-board__subtitle">
                    Review saved dashboard prompts and expand each item to view
                    the engine response when available.
                  </p>
                </div>
              </div>

              <div className="library-layout">
                <div className="library-layout__scroll">
                  {entries.length === 0 ? (
                    <div className="library-empty">
                      <div className="library-empty__icon">▱</div>
                      <h2 className="library-empty__title">No history yet</h2>
                      <p className="library-empty__text">
                        Prompts generated from the dashboard will appear here.
                        Once your engine response is connected, expanding an
                        item will show the returned output as well.
                      </p>
                    </div>
                  ) : (
                    <div className="library-list">
                      {entries.map((entry, index) => {
                        const isOpen = openId === entry.id;

                        return (
                          <article
                            className={`library-item ${
                              isOpen ? "library-item--open" : ""
                            }`}
                            key={entry.id}
                          >
                            <button
                              type="button"
                              className="library-item__summary"
                              onClick={() => toggleEntry(entry.id)}
                              aria-expanded={isOpen}
                            >
                              <div className="library-item__meta">
                                <span className="library-item__index">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <div>
                                  <h2 className="library-item__prompt">
                                    {entry.prompt}
                                  </h2>
                                  <p className="library-item__date">
                                    {formatDate(entry.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <span className="library-item__chevron">
                                {isOpen ? "−" : "+"}
                              </span>
                            </button>

                            {isOpen && (
                              <div className="library-item__body">
                                <div className="library-item__response">
                                  {entry.response?.trim() ? (
                                    <p>{entry.response}</p>
                                  ) : (
                                    <p className="library-item__placeholder">
                                      No engine response linked yet. The prompt
                                      has been saved and this section is ready
                                      for the response output.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
