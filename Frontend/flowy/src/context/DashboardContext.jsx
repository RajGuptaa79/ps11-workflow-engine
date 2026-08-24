import { createContext, useContext, useMemo, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [query, setQuery] = useState("");
  // Values populated by the workflow-detection backend when it is connected.
  const [workflow, setWorkflow] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const resetDashboard = () => {
    setQuery("");
    setWorkflow(null);
    setIsGenerating(false);
    setGenerationError("");
    setIsGenerated(false);
    setIsAddMenuOpen(false);
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      workflow,
      setWorkflow,
      isGenerating,
      setIsGenerating,
      generationError,
      setGenerationError,
      isGenerated,
      setIsGenerated,
      isAddMenuOpen,
      setIsAddMenuOpen,
      resetDashboard,
    }),
    [
      query,
      workflow,
      isGenerating,
      generationError,
      isGenerated,
      isAddMenuOpen,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
