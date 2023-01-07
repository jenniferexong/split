import { ActionMeta } from 'react-select';
import Creatable from 'react-select/creatable';
import { getOptionValue } from './utils';
import { Option } from './types';
import styled from 'styled-components';

interface SelectProps<TOption> {
  options: TOption[];
  value: TOption | null;
  placeholder: string;
  onChangeOption: (
    option: TOption | null,
    actionMeta: ActionMeta<TOption>,
  ) => void;
  onCreateOption: (inputValue: string) => void;
}

const components = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

const StyledCreatable = styled(Creatable)<{ textAlign: string }>`
  .react-select {
    &__value-container {
      padding: 0;
    }

    &__input-container {
      padding: 0;
      margin: 0;
      display: flex;
    }

    &__input-container::after {
      content: none;
    }

    &__control {
      border: none;
      border-radius: 0;
      min-height: 0;
    }

    &__input {
      text-transform: uppercase;
      width: 100%;
      grid-area: 1 / -1 / auto/auto;
    }
  }
` as typeof Creatable;

// eslint-disable-next-line comma-spacing
export const Select = <TOption extends Option<any>>(
  props: SelectProps<TOption>,
) => {
  const { options, value, placeholder, onChangeOption, onCreateOption } = props;

  return (
    <StyledCreatable<TOption>
      classNamePrefix={'react-select'}
      placeholder={placeholder}
      options={options}
      value={value}
      getOptionValue={getOptionValue}
      onChange={onChangeOption}
      onCreateOption={onCreateOption}
      components={components}
    />
  );
};
Select.displayName = 'Select';
