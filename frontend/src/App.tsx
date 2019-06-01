import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';

import { GlobalContextProvider } from './context/GlobalContext';
import MainApp from './components/MainApp';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <BrowserRouter>
        <GlobalContextProvider>
          <MainApp />
        </GlobalContextProvider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
