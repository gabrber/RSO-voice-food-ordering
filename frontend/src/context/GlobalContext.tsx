import React, { useReducer } from "react";
import { globalReducer } from "./reducers";

const GlobalContext = React.createContext<any[]>([]);

const GlobalContextProvider: React.FC = ({ children }) => {
  const context = useReducer(globalReducer, { menu: [] });
  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
