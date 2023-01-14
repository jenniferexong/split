import { forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { backgroundHover } from 'styles/mixins';
import { BaseButtonProps } from './types';

const StyledButton = styled.button`
  width: 100%;
  border: none;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.black};
  text-align: left;

  ${backgroundHover()}

  &:focus {
    color: ${props => props.theme.colors.red};
  }
`;

export const ReceiptButton = forwardRef(
  (props: BaseButtonProps, ref?: Ref<HTMLButtonElement>) => {
    const { children, onClick } = props;

    return (
      <StyledButton ref={ref} onClick={onClick}>
        {children}
      </StyledButton>
    );
  },
);
ReceiptButton.displayName = 'ReceiptButton';
