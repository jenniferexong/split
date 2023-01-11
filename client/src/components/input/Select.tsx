import ReactSelect, { ActionMeta } from 'react-select';
import { getOptionValue } from './utils';
import { Option } from './types';
import styled from 'styled-components';
import { backgroundHover } from 'styles/mixins';

interface SelectProps<TOption> {
  options: TOption[];
  value: TOption | null;
  placeholder: string;
  onChangeOption: (
    option: TOption | null,
    actionMeta: ActionMeta<TOption>,
  ) => void;
  isSearchable?: boolean;
  // should be used together
  menuIsOpen?: boolean;
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
}

const components = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

const StyledSelect = styled(ReactSelect)<{ textAlign: string }>`
  .react-select {
    &__value-container {
      padding: 0;
    }

    &__input-container {
      padding: 0;
      margin: 0;
      display: flex;
      color: ${props => props.theme.colors.black};
    }

    &__single-value {
      color: ${props => props.theme.colors.black};
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
` as typeof ReactSelect;

export const Select = <TOption extends Option<any>>(
  props: SelectProps<TOption>,
) => {
  const {
    options,
    value,
    placeholder,
    menuIsOpen,
    isSearchable,
    onChangeOption,
    onMenuOpen,
    onMenuClose,
  } = props;

  return (
    <StyledSelect<TOption>
      classNamePrefix="react-select"
      placeholder={placeholder}
      options={options}
      value={value}
      getOptionValue={getOptionValue}
      onChange={onChangeOption}
      menuIsOpen={menuIsOpen}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
      components={components}
      isSearchable={isSearchable}
    />
  );
};
Select.displayName = 'Select';
