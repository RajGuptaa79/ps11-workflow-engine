import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import QueryPanel from "../components/common/home/QueryPanel.jsx";
import ResultPanel from "../components/common/home/ResultPanel.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import HomeMotionLayer from "../components/common/home/HomeMotionLayer.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import { API_ENDPOINTS } from "../config/api.js";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { addEntry } = useLibrary();

  const {
    query,
    setQuery,
    workflow,
    setWorkflow,
    setIsGenerating,
    generationError,
    setGenerationError,
    isGenerated,
    setIsGenerated,
    isAddMenuOpen,
    setIsAddMenuOpen,
  } = useDashboard();

  const handleGenerate = async () => {
    const prompt = query.trim();

    if (!prompt) return;

    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch(API_ENDPOINTS.detectWorkflow, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail ?? "Workflow generation failed.");
      }

      // Keep the full JSON returned by the API, exactly as Swagger shows it.
      setWorkflow(result);
      addEntry(prompt, JSON.stringify(result));
      setIsGenerated(true);
      setIsAddMenuOpen(false);
    } catch (error) {
      setGenerationError(error.message ?? "Workflow generation failed.");
      setWorkflow(null);
      setIsGenerated(true);
      setIsAddMenuOpen(false);
    } finally {
      setIsGenerating(false);
    }
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
                <ResultPanel
                  isGenerated={true}
                  query={query}
                  workflow={workflow}
                  error={generationError}
                />

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
