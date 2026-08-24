import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import QueryPanel from "../components/common/home/QueryPanel.jsx";
import ResultPanel from "../components/common/home/ResultPanel.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import HomeMotionLayer from "../components/common/home/HomeMotionLayer.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { addEntry } = useLibrary();

  const {
    query,
    setQuery,
    isGenerated,
    setIsGenerated,
    isAddMenuOpen,
    setIsAddMenuOpen,
  } = useDashboard();

  const handleGenerate = () => {
    if (!query.trim()) return;
    addEntry(query, "");
    setIsGenerated(true);
    setIsAddMenuOpen(false);
  };

  const handleAddToggle = () => {
    setIsAddMenuOpen((prev) => !prev);
  };

  const handleAddItemClick = (item) => {
    console.log(`${item} clicked`);
    setIsAddMenuOpen(false);
  };

  return (
    <div className="home-main">
      <TopNavbar />

      <div className="home-shell">
        <SideNavbar />

        <div className="home-workspace">
          <PolkaField />
          <HomeMotionLayer isVisible={isGenerated} />

          {!isGenerated && (
            <div className="home-center">
              <QueryPanel
                query={query}
                setQuery={setQuery}
                onGenerate={handleGenerate}
                generated={false}
                isAddMenuOpen={false}
                onAddToggle={() => {}}
                onAddItemClick={() => {}}
              />
            </div>
          )}

          {isGenerated && (
            <div className="home-generated-layout">
              <div className="home-generated-top">
                <QueryPanel
                  query={query}
                  setQuery={setQuery}
                  onGenerate={handleGenerate}
                  generated={true}
                  isAddMenuOpen={isAddMenuOpen}
                  onAddToggle={handleAddToggle}
                  onAddItemClick={handleAddItemClick}
                />
              </div>

              <div className="home-output home-output--visible">
                <ResultPanel isGenerated={true} query={query} />

                <button
                  className="diagram-rail diagram-rail--visible"
                  type="button"
                  aria-label="Open diagram"
                  onClick={() =>
                    navigate("/diagram", {
                      state: { transition: "diagram-rail-forward" },
                    })
                  }
                >
                  <span className="diagram-rail__arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="diagram-rail__label">Diagram</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
