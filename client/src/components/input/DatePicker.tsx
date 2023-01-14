import styled from 'styled-components';
import ReactDatePicker from 'react-datepicker';
import { useCallback } from 'react';
import { backgroundHover } from 'styles/mixins';

const StyledDatePicker = styled(ReactDatePicker)`
  border: none;
  outline: none;
  text-transform: uppercase;

  :focus {
    box-shadow: 0 0 0 1px ${props => props.theme.colors.blue};
  }

  ::placeholder {
    color: ${props => props.theme.colors.red};
    opacity: 1;
  }

  ${backgroundHover()}
`;

interface DatePickerProps {
  value: Date | null;
  onChangeDate: (date: Date) => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const { value, onChangeDate } = props;

  const handleChangeDate = useCallback(
    (date: Date | null) => {
      if (!date) {
        return;
      }

      onChangeDate(date);
    },
    [onChangeDate],
  );

  return (
    <StyledDatePicker
      placeholderText="Select a date"
      selected={value}
      onChange={handleChangeDate}
      dateFormat="dd/MM/yyyy"
    />
  );
};
DatePicker.displayName = 'DatePicker';
