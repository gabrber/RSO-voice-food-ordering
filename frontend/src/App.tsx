import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainAppBar from "./components/MainAppBar";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Orders from "./components/orders/Orders";
import Menu from "./components/menu/Menu";
import { GlobalContextProvider } from "./context/GlobalContext";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <BrowserRouter>
        <MainAppBar />
        <GlobalContextProvider>
          <Switch>
            <Route exact path="/menu" component={Menu} />
            <Route path="/" component={Orders} />
          </Switch>
        </GlobalContextProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
