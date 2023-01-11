import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Option } from '../types';

export const useOptionValue = <TData>(
  initialValue: TData | undefined,
  mapper: (data: TData) => Option<TData>,
): [Option<TData> | null, Dispatch<SetStateAction<Option<TData> | null>>] => {
  const initial = useMemo(
    () => (initialValue ? mapper(initialValue) : null),
    [initialValue, mapper],
  );

  const [optionValue, setOptionValue] = useState<Option<TData> | null>(initial);

  useLayoutEffect(() => {
    setOptionValue(initial);
  }, [initial]);

  return [optionValue, setOptionValue];
};
