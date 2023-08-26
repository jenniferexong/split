import { forwardRef, Ref } from 'react';
import styled, { css } from 'styled-components';
import { BaseButtonProps } from '../button';
import { fontMixin, transition } from '../../styles';

const StyledButton = styled.button<BaseButtonProps>`
  ${({ theme, onClick }) => css`
    ${fontMixin(theme.fonts.boardLetter)}
    padding: 20px 80px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.6);

    background: none;
    border: none;
    grid-column: span 2;

    ${onClick &&
    css`
      ${transition('transform')}
      &:hover {
        transform: scale(1.3);
      }
    `}
  `}
`;

export const BoardLetters = forwardRef(
  (props: BaseButtonProps, ref?: Ref<HTMLButtonElement>) => {
    const { children, className, onClick } = props;

    return (
      <StyledButton ref={ref} className={className} onClick={onClick}>
        {children}
      </StyledButton>
    );
  },
);
BoardLetters.displayName = 'BoardLetters';
