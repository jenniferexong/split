import { ActionMeta } from 'react-select';
import Creatable from 'react-select/creatable';
import { getOptionValue } from './utils';
import { Option } from './types';

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

// eslint-disable-next-line comma-spacing
export const Select = <TOption extends Option<any>>(
  props: SelectProps<TOption>,
) => {
  const { options, value, placeholder, onChangeOption, onCreateOption } = props;
  return (
    <Creatable<TOption>
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
