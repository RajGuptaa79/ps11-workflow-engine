import { createContext, useContext, useMemo, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [query, setQuery] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const resetDashboard = () => {
    setQuery("");
    setIsGenerated(false);
    setIsAddMenuOpen(false);
  };

  const value = useMemo(
    () => ({
      query,
      setQuery,
      isGenerated,
      setIsGenerated,
      isAddMenuOpen,
      setIsAddMenuOpen,
      resetDashboard,
    }),
    [query, isGenerated, isAddMenuOpen],
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
