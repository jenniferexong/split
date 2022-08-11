import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from './types';

const StyledButton = styled.button`
  width: 100%;
  border: none;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.black};
  text-align: left;

  // add hover effect
  &:hover {
    background-color: lightGray;
  }

  // add focus effect
  &:focus {
    color: ${props => props.theme.colors.red};
  }
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
