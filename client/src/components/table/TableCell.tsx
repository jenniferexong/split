import { FocusEvent, FocusEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { fontMixin } from '../../styles';
import { handleCellKeyDown } from './utils';

interface TableCellProps {
  children?: ReactNode;
  as?: 'td' | 'th';
  onBlur?: FocusEventHandler<HTMLTableCellElement>;

  bold?: boolean;
  textSize?: 'normal' | 'small';
  colSpan?: number;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const StyledTableCell = styled.td<{
  as: string;
  textAlign: string;
  textSize: 'normal' | 'small';
  bold?: boolean;
}>`
  ${({ theme, as, textAlign, textSize, bold }) => css`
    position: relative;
    ${fontMixin(theme.fonts.default)}
    white-space: nowrap;

    ${bold &&
    css`
      font-weight: bolder;
    `}

    text-align: ${textAlign};
    input {
      text-align: ${textAlign};
    }

    ${textSize === 'small' &&
    css`
      font-size: 10px;
    `}

    ${as === 'th' &&
    css`
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.2em;

      .react-select__input {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.2em;
      }
    `}
  `}
`;

export const TableCell = ({
  as = 'td',
  textAlign = 'left',
  textSize = 'normal',
  ...props
}: TableCellProps) => {
  const { children, onBlur, ...rest } = props;

  const setBlur = (e: FocusEvent<HTMLTableCellElement, Element>) => {
    onBlur?.(e);
  };

  return (
    <StyledTableCell
      onBlur={setBlur}
      onKeyDown={handleCellKeyDown}
      as={as}
      textAlign={textAlign}
      textSize={textSize}
      spellCheck={false}
      {...rest}
    >
      {children}
    </StyledTableCell>
  );
};
TableCell.displayName = 'TableCell';
