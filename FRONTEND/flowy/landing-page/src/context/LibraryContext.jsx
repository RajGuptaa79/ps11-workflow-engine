import { createContext, useContext, useMemo, useState } from "react";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [entries, setEntries] = useState([]);

  const addEntry = (prompt, response = "") => {
    const cleanPrompt = prompt?.trim();
    if (!cleanPrompt) return null;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const newEntry = {
      id,
      prompt: cleanPrompt,
      response,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    return id;
  };

  const updateEntryResponse = (id, response) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, response: response ?? "" } : entry,
      ),
    );
  };

  const value = useMemo(
    () => ({
      entries,
      addEntry,
      updateEntryResponse,
    }),
    [entries],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
