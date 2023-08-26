import { createGlobalStyle, css } from 'styled-components';
import normalize from 'styled-normalize';
import { fontMixin } from './mixins/fontMixin';
import { hideScrollbars } from './mixins';

import './fonts.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

export const GlobalStyle = createGlobalStyle`
    ${normalize}

    ${hideScrollbars}

    ${({ theme }) => css`
      body {
        width: 100vw;
        min-height: 100vh;
        height: 100%;

        ${fontMixin(theme.fonts.default)}

        margin: 0;
        background-color: ${theme.colors.beige};
      }

      #root {
        width: 100%;
        min-height: 100vh;
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
        text-transform: uppercase;
      }

      h1 {
        font-size: 40px;
        letter-spacing: 0.2em;
      }

      h2 {
        font-size: 30px;
        letter-spacing: 0.2em;
      }

      h3 {
        font-size: 24px;
      }

      h4 {
        font-size: 20px;
      }

      h5 {
        font-size: 16px;
      }
    `}
`;
