import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import { GlobalContextProvider } from './context/GlobalContext';
import MainApp from './components/MainApp';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <CookiesProvider>
        <BrowserRouter>
          <GlobalContextProvider>
            <MainApp />
          </GlobalContextProvider>
        </BrowserRouter>
      </CookiesProvider>
    </React.Fragment>
  );
};

export default App;
