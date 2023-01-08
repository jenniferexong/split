import { Option } from './types';
import { FocusEvent } from 'react';

export const getOptionValue = <TOption extends Option<any>>(option: TOption) =>
  option.label;

export const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
  e.target.select();
};
