import { Option } from './types';

export const getOptionValue = <TOption extends Option<any>>(option: TOption) =>
  option.label;
