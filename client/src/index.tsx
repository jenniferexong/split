import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'urql';
import { splitClient } from './api';
import { theme, GlobalStyle } from './styles';
import { Routes } from './pages/Routes';

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
