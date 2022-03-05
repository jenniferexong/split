import { ReactNode } from "react";
import { createGlobalStyle, css } from "styled-components";
import normalize from "styled-normalize";

export const GlobalStyle = createGlobalStyle`
    ${normalize}

    ${({ theme }) => css`
      body {
        font-family: ${theme.baseFont.font};
        color: ${theme.baseFont.color};
        margin: 0;
        background-color: ${theme.background};
        padding: 100px 300px;
        display: flex;
        justify-content: center;
      }

      p {
        font-size: ${theme.baseFont.size};
        color: ${theme.baseFont.color};
        line-height: ${theme.baseFont.lineHeight};
      }

      div {
        box-sizing: border-box;
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        font-weight: 400;
        color: ${theme.colors.accent};
      }
    `}
`;
