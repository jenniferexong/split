import { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  /** Button text */
  children: ReactNode;
  onClick(): void;
}

const StyledButton = styled.button`
  border: none;
  background-color: ${(props) => props.theme.colors.button};

  // add hover effect
  &:hover {
    background-color: #a4a4a4;
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
