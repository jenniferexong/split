import React from 'react';
import { createRoot } from 'react-dom/client';
import { Routes } from './pages/Routes';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/GlobalStyle';
import { theme } from 'styles';
import { splitClient } from 'api/client';
import { Provider } from 'urql';

const container = document.getElementById('root');
if (!container) throw new Error('No root');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider value={splitClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
