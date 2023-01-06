import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { StoreOption } from 'components/select';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { insertIntoSortedArray } from 'utils/insertIntoSortedArray';

const convertStoreToOption = (store: ApiStore): StoreOption => ({
  label: store.name,
  data: store,
});

interface EntryPageContextValue {
  storeOptions: StoreOption[];
  // productOptions: ProductOption[];
  // personOptions: PersonOption[];
  addStoreOption: (store: ApiStore) => StoreOption;
  // addProductOption: (store: ApiProduct) => void;
  // addPersonOption: (store: ApiPerson) => void;
}

const EntryPageContext = createContext<EntryPageContextValue>({
  storeOptions: [],
  // productOptions: [],
  // personOptions: [],
  addStoreOption: () => null as unknown as StoreOption,
  // addProductOption: noop,
  // addPersonOption: noop,
});

interface EntryPageContextProviderProps {
  children: ReactNode | ReactNode[];
  loadedStores: ApiStore[];
  loadedProducts: ApiProduct[];
  loadedPeople: ApiPerson[];
}

export const EntryPageContextProvider = (
  props: EntryPageContextProviderProps,
) => {
  const { loadedStores, children } = props;

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>(
    loadedStores.map(convertStoreToOption),
  );

  const addStoreOption = useCallback(
    (store: ApiStore): StoreOption => {
      const newOption = convertStoreToOption(store);

      setStoreOptions(
        insertIntoSortedArray(storeOptions, newOption, option => option.label),
      );

      return newOption;
    },
    [storeOptions],
  );

  const value: EntryPageContextValue = useMemo(
    () => ({
      storeOptions,
      addStoreOption,
    }),
    [addStoreOption, storeOptions],
  );

  return (
    <EntryPageContext.Provider value={value}>
      {children}
    </EntryPageContext.Provider>
  );
};

export const useEntryPageContext = (): EntryPageContextValue => {
  const contextValue = useContext(EntryPageContext);

  if (!contextValue) {
    throw new Error(
      'EntryPageContext must be used within an EntryPageContextProvider',
    );
  }

  return contextValue;
};
