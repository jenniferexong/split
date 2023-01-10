import { FocusEvent } from 'react';

export const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
  e.target.select();
};
