import React, { ReactNode } from 'react';
import { handleCellKeyDown } from 'components/table';
import styled, { css } from 'styled-components';
import { fontMixin } from 'styles/mixins';

interface TableCellProps {
  children?: ReactNode;
  as?: 'td' | 'th';
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;

  contentEditable?: boolean;
  colSpan?: number;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const StyledTableCell = styled.td<{ as: string; textAlign: string }>`
  ${({ theme, as, textAlign }) => css`
    ${fontMixin(theme.fonts.receipt)}

    text-align: ${textAlign};

    ${as === 'th' &&
    css`
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.2em;
    `}
  `}
`;

export const TableCell = ({
  as = 'td',
  textAlign = 'left',
  ...props
}: TableCellProps) => {
  const { children, onBlur, ...rest } = props;

  const setBlur = (e: React.FocusEvent<HTMLTableCellElement, Element>) => {
    onBlur?.(e);
  };

  return (
    <StyledTableCell
      onBlur={setBlur}
      onKeyDown={handleCellKeyDown}
      as={as}
      textAlign={textAlign}
      spellCheck={false}
      {...rest}
    >
      {children}
    </StyledTableCell>
  );
};
TableCell.displayName = 'TableCell';
