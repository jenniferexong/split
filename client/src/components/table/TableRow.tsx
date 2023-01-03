import styled, { css } from 'styled-components';

export const TableRow = styled.tr<{
  borderTop?: boolean;
  borderBottom?: boolean;
}>`
  ${({ theme, borderTop, borderBottom }) => css`
    > *:first-child {
      padding-left: 12px;
    }

    > *:last-child {
      padding-right: 12px;
    }

    ${borderTop &&
    css`
      & > * {
        padding-top: 12px;
      }

      border-top: 1.5px dashed ${theme.colors.black};
    `}

    ${borderBottom &&
    css`
      & > * {
        padding-bottom: 12px;
      }

      border-bottom: 1.5px dashed ${theme.colors.black};
    `}
  `}
`;
