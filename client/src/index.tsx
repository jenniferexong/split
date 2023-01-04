import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from './Routes';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/GlobalStyle';
import { theme } from 'styles';
import { splitClient } from 'api/client';
import { Provider } from 'urql';

ReactDOM.render(
  <React.StrictMode>
    <Provider value={splitClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
