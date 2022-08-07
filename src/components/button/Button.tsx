import { ReactNode } from "react";
import React from "react";
import styled from "styled-components";
import { Props } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  /** Button text */
  children: ReactNode;
  onClick(): void;
}

const StyledButton = styled.button`
  width: 100%;
  border: none;
  background-color: ${(props) => props.theme.components.button.background};
  color: ${(props) => props.theme.components.button.textColor};

  // add hover effect
  &:hover {
    background-color: black;
  }

  // add focus effect
  &:focus {
    color: ${(props) => props.theme.colors.accent};
  }

  margin: 1em 0;
  padding: 0.5em;
`;

export const Button = React.forwardRef(
  ({ children, onClick }: ButtonProps, ref?: React.Ref<HTMLButtonElement>) => {
    return (
      <StyledButton ref={ref} onClick={onClick}>
        {children}
      </StyledButton>
    );
  }
);
