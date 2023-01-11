import { css, FlattenSimpleInterpolation } from 'styled-components';

export const transition = (
  property: string,
  ...rest: string[]
): FlattenSimpleInterpolation => css`
  transition-property: ${[property, ...rest].join(', ')};
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
`;
