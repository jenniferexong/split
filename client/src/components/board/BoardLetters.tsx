import { ButtonProps } from 'components/button';
import React from 'react';
import styled, { css } from 'styled-components';
import { fontMixin } from 'styles/mixins';
import { transition } from 'styles/mixins/transition';

const StyledButton = styled.button`
  ${({ theme }) => css`
    ${fontMixin(theme.fonts.boardLetter)}
    padding: 20px 80px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.6);

    background: none;
    border: none;
    grid-column: span 2;

    ${transition('transform')}
    &:hover {
      transform: scale(1.3);
    }
  `}
`;

export const BoardLetters = React.forwardRef(
  (props: ButtonProps, ref?: React.Ref<HTMLButtonElement>) => {
    const { children, onClick } = props;

    return (
      <StyledButton ref={ref} onClick={onClick}>
        {children}
      </StyledButton>
    );
  },
);
BoardLetters.displayName = 'BoardLetters';
