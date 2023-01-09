import { ActionMeta } from 'react-select';
import Creatable from 'react-select/creatable';
import { getOptionValue } from './utils';
import { Option } from './types';
import styled from 'styled-components';
import { backgroundHover } from 'styles/mixins/backgroundHover';

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

      ${backgroundHover()}
      &--is-focused {
        box-shadow: 0 0 0 1px ${props => props.theme.colors.blue};
      }
    }

    &__input {
      text-transform: uppercase;
      width: 100%;
      grid-area: 1 / -1 / auto/auto;
    }

    &__placeholder {
      color: ${props => props.theme.colors.red};
    }
  }
` as typeof Creatable;

export const CreateableSelect = <TOption extends Option<any>>(
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
CreateableSelect.displayName = 'CreateableSelect';
