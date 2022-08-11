import React, { ReactNode } from 'react';
import { handleCellKeyDown, onCellFocus } from 'components/table';
import styled, { css } from 'styled-components';
import { fontMixin } from 'styles/mixins';

interface TableCellProps {
  children?: ReactNode;
  as?: 'td' | 'th';
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;

  contentEditable?: boolean;
  colSpan?: number;
  width?: string;
  dir?: string;
}

const StyledTableCell = styled.td<{ as: string }>`
  ${({ theme, as }) => css`
    ${fontMixin(theme.fonts.receipt)}

    ${as === 'th' &&
    css`
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.2em;
    `}
  `}
`;

export const TableCell = ({ as = 'td', ...props }: TableCellProps) => {
  const { children, onBlur, ...rest } = props;

  const setBlur = (e: React.FocusEvent<HTMLTableCellElement, Element>) => {
    onBlur?.(e);
  };

  return (
    <StyledTableCell
      onFocus={onCellFocus}
      onBlur={setBlur}
      onKeyDown={handleCellKeyDown}
      as={as}
      spellCheck={false}
      {...rest}
    >
      {children}
    </StyledTableCell>
  );
};
TableCell.displayName = 'TableCell';
