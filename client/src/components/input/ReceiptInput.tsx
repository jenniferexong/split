import {
  HTMLInputTypeAttribute,
  ChangeEventHandler,
  FocusEventHandler,
} from 'react';
import styled from 'styled-components';
import { onInputFocus } from './utils';
import { backgroundHover } from '../../styles';

const StyledInput = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  outline: none;

  :focus {
    box-shadow: 0 0 0 1px ${props => props.theme.colors.blue};
  }

  ${backgroundHover()}
`;

export interface InputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  className?: string;
  type?: HTMLInputTypeAttribute;
}

export const ReceiptInput = (props: InputProps) => {
  const { value, className, onChange, onBlur } = props;

  return (
    <StyledInput
      className={className}
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onInputFocus}
    />
  );
};
ReceiptInput.displayName = 'ReceiptInput';
