import { css, FlattenSimpleInterpolation } from 'styled-components';

export const hideScrollbars = (): FlattenSimpleInterpolation => css`
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }

  html,
  body {
    * {
      scrollbar-width: none;
    }
  }
`;
