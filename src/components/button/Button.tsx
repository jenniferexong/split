import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  /** Button text */
  children: ReactNode;
  onClick(): void;
}

const StyledButton = styled.button`
  width: 100%;
  border: none;
  background-color: ${props => props.theme.components.button.background};
  color: ${props => props.theme.components.button.textColor};

  // add hover effect
  &:hover {
    background-color: black;
  }

  // add focus effect
  &:focus {
    color: ${props => props.theme.colors.accent};
  }

  margin: 1em 0;
  padding: 0.5em;
`;

export const Button = React.forwardRef(
  (props: ButtonProps, ref?: React.Ref<HTMLButtonElement>) => {
    const { children, onClick } = props;

    return (
      <StyledButton ref={ref} onClick={onClick}>
        {children}
      </StyledButton>
    );
  },
);
Button.displayName = 'Button';
