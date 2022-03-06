import { ReactNode } from "react";
import { createGlobalStyle, css } from "styled-components";
import normalize from "styled-normalize";

export const GlobalStyle = createGlobalStyle`
    ${normalize}

    ${({ theme }) => css`
      body {
        width: 100vw;
        height: 100vh;

        font-family: ${theme.baseFont.font};
        font-size: ${theme.baseFont.size};
        color: ${theme.baseFont.color};
        line-height: ${theme.baseFont.lineHeight};

        margin: 0;
        background-color: ${theme.background};
        box-sizing: border-box;
        padding: 100px 300px;
        /* justify-content: center; */
      }

      div,
      section {
        box-sizing: border-box;
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        font-weight: 400;
        color: ${theme.colors.accent};
        margin-top: 0;
      }
    `}
`;
