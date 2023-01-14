import { css, FlattenSimpleInterpolation } from 'styled-components';
import { transition } from './transition';

export const backgroundHover = (): FlattenSimpleInterpolation => css`
  ${transition('background')}
  &:hover {
    background: lightGray;
  }
`;
