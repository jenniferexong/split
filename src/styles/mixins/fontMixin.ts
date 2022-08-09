import { css, FlattenSimpleInterpolation } from 'styled-components';
import { Font } from 'styles/types';

export const fontMixin = (font: Font): FlattenSimpleInterpolation => {
  const { family, baseSize, baseWeight, color, lineHeight } = font;

  return css`
    font-family: ${family};
    font-size: ${baseSize};
    font-weight: ${baseWeight};
    color: ${color};
    line-height: ${lineHeight};
  `;
};
