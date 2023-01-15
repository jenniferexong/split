import { useBoardWidth } from 'components/board/BoardContext';
import { stripUnit } from 'polished';
import { useLayoutEffect, useState } from 'react';
import { useTheme } from 'styled-components';

const pxToNumber = (px: string): number => {
  return stripUnit(px) as number;
};

/**
 * Generates an x offset to apply to a receipt that will position
 * it randomly (horizontally) inside a board (without its sides being cut off).
 */
export const usePositionReceipt = () => {
  const theme = useTheme();
  const boardWidth = useBoardWidth();

  const [position] = useState<number>(Math.random());
  const [xOffset, setXOffset] = useState<number>(0);

  // Calculations done in pixels
  useLayoutEffect(() => {
    const boardPadding = 90;

    const slideArea =
      boardWidth -
      pxToNumber(theme.components.receipt.width) -
      2 * boardPadding;

    const offset = slideArea * position - slideArea / 2;
    setXOffset(offset);
  }, [boardWidth, position, theme]);

  return { xOffset };
};
