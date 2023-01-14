import ReactSelect, { ActionMeta } from 'react-select';
import { getOptionValue } from './utils';
import { Option } from './types';
import styled from 'styled-components';
import { reactSelect } from 'styles/mixins';

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
  ${props => reactSelect(props.theme)}
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
