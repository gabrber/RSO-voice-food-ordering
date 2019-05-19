import React, { useState } from "react";
const GlobalContext = React.createContext([{}, () => {}]);

const GlobalContextProvider = (props: any) => {
  const [state, setState] = useState("kappa");
  return (
    <GlobalContext.Provider value={[state, setState]}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
