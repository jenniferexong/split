import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import styled from 'styled-components';
import { backgroundHover } from 'styles/mixins';

const StyledInput = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  border-bottom: 1.5px dashed ${props => props.theme.colors.black};
  outline: none;
  height: 44px;
  font-size: 16px;

  margin-top: 8px;

  :focus {
    box-shadow: 0 0 0 1px ${props => props.theme.colors.blue};
  }

  ${backgroundHover()}
`;

const StyledLabel = styled.label`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface InputProps {
  label: string;
  value: string;
  name: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Input = (props: InputProps) => {
  const {
    label,
    name,
    value,
    placeholder,
    required,
    type = 'text',
    onChange,
  } = props;

  return (
    <Container>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
      />
    </Container>
  );
};
Input.displayName = 'Input';
