import { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  /** Button text */
  children: ReactNode;
  onClick(): void;
}

const StyledButton = styled.button`
  border: none;
  background-color: ${(props) => props.theme.components.button.background};
  color: ${(props) => props.theme.components.button.textColor};

  // add hover effect
  &:hover {
    background-color: black;
  }
  margin: 1em 0;
  padding: 0.5em;
`;

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
