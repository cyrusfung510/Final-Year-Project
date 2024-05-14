import React from "react";
import { createContext } from "react";
import { useHistory } from "react-router-dom";

export const HistoryContext = createContext();
export function HistoryProvider({ children }) {
  const history = useHistory();
  return (
    <HistoryContext.Provider value={history}>{children}</HistoryContext.Provider>
  );
}