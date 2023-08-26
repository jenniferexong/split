import { ActionMeta } from 'react-select';
import styled from 'styled-components';
import Creatable from 'react-select/creatable';
import { Option } from './types';
import { getOptionValue } from './utils';
import { reactSelect } from '../../styles';

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
  ${props => reactSelect(props.theme)}
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
