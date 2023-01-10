import { Dispatch, SetStateAction, useState } from 'react';
import { Option } from '../types';

export const useOptionValue = <TData>(
  initialValue: TData | undefined,
  mapper: (data: TData) => Option<TData>,
): [Option<TData> | null, Dispatch<SetStateAction<Option<TData> | null>>] => {
  const initial = initialValue ? mapper(initialValue) : null;
  const [optionValue, setOptionValue] = useState<Option<TData> | null>(initial);

  return [optionValue, setOptionValue];
};
