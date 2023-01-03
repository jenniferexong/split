import { Color, Theme } from './types';

export const getColor = (color: Color, theme: Theme): string =>
  theme.colors[color];
