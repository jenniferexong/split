import { darken } from 'polished';
import { forwardRef, Ref } from 'react';
import styled, { css } from 'styled-components';
import { backgroundHover, transition } from 'styles/mixins';
import { BaseButtonProps } from './types';

interface ButtonProps extends BaseButtonProps {
  mode?: 'primary' | 'secondary';
  className?: string;
}

const StyledButton = styled.button<{ mode: 'primary' | 'secondary' }>`
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;

  border-width: 1.5px;
  border-style: dashed;

  ${({ mode, theme }) =>
    mode === 'primary' &&
    css`
      background: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
      color: ${theme.colors.white};

      &:hover {
        border-color: ${darken(0.1, theme.colors.primary)};
        background: ${darken(0.1, theme.colors.primary)};
      }

      ${transition('background', 'border-color')}
    `}

  ${({ mode, theme }) =>
    mode === 'secondary' &&
    css`
      background: none;
      border-color: ${theme.colors.black};
      color: ${theme.colors.black};

      ${backgroundHover}
    `}
`;

export const Button = forwardRef(
  (props: ButtonProps, ref?: Ref<HTMLButtonElement>) => {
    const { mode = 'primary', children, className, onClick } = props;

    return (
      <StyledButton
        ref={ref}
        onClick={onClick}
        className={className}
        mode={mode}
      >
        {children}
      </StyledButton>
    );
  },
);
Button.displayName = 'Button';
