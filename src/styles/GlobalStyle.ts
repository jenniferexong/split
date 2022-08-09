import { createGlobalStyle, css } from 'styled-components';
import normalize from 'styled-normalize';
import { fontMixin } from './mixins/fontMixin';

export const GlobalStyle = createGlobalStyle`
    ${normalize}

    ${({ theme }) => css`
      body {
        width: 100vw;
        height: 100vh;

        ${fontMixin(theme.fonts.receipt)}

        margin: 0;
        background-color: ${theme.colors.beige};
      }

      #root {
        width: 100%;
        height: 100%;
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
        font-weight: 700;
        margin: 0;
        line-height: 1;
      }

      h3 {
        font-size: 20px;
      }

      h4 {
        font-size: 16px;
      }
    `}
`;
