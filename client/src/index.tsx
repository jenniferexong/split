import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
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
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
