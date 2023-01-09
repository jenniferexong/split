import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { AppType } from 'calculator/types';
import { PersonOption, ProductOption, StoreOption } from 'components/input';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { insertIntoSortedArray } from 'utils/insertIntoSortedArray';
import { noop } from 'utils/noop';
import { Action, initialState } from 'utils/reducer';

const convertStoreToOption = (store: ApiStore): StoreOption => ({
  label: store.name,
  data: store,
});

const convertProductToOption = (product: ApiProduct): ProductOption => ({
  label: product.name,
  data: product,
});

const convertPersonToOption = (person: ApiPerson): PersonOption => ({
  label: person.firstName,
  data: person,
});

interface EntryPageContextValue {
  storeOptions: StoreOption[];
  productOptions: ProductOption[];
  personOptions: PersonOption[];
  appState: AppType;
  dispatch: Dispatch<Action>;
  addStoreOption: (store: ApiStore) => StoreOption;
  addProductOption: (store: ApiProduct) => ProductOption;
  addPersonOption: (store: ApiPerson) => void;
}

const EntryPageContext = createContext<EntryPageContextValue>({
  storeOptions: [],
  productOptions: [],
  personOptions: [],
  appState: initialState,
  dispatch: noop,
  addStoreOption: () => null as unknown as StoreOption,
  addProductOption: () => null as unknown as ProductOption,
  addPersonOption: () => null as unknown as PersonOption,
});

interface EntryPageContextProviderProps {
  children: ReactNode | ReactNode[];
  appState: AppType;
  loadedStores: ApiStore[];
  loadedProducts: ApiProduct[];
  loadedPeople: ApiPerson[];
  dispatch: Dispatch<Action>;
}

export const EntryPageContextProvider = (
  props: EntryPageContextProviderProps,
) => {
  const {
    appState,
    loadedStores,
    loadedProducts,
    loadedPeople,
    children,
    dispatch,
  } = props;

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>(
    loadedStores.map(convertStoreToOption),
  );

  const [productOptions, setProductOptions] = useState<ProductOption[]>(
    loadedProducts.map(convertProductToOption),
  );

  const [personOptions, setPersonOptions] = useState<PersonOption[]>(
    loadedPeople.map(convertPersonToOption),
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

  const addProductOption = useCallback(
    (product: ApiProduct): ProductOption => {
      const newOption = convertProductToOption(product);

      setProductOptions(
        insertIntoSortedArray(
          productOptions,
          newOption,
          option => option.label,
        ),
      );

      return newOption;
    },
    [productOptions],
  );

  const addPersonOption = useCallback(
    (person: ApiPerson): PersonOption => {
      const newOption = convertPersonToOption(person);

      setPersonOptions(
        insertIntoSortedArray(personOptions, newOption, option => option.label),
      );

      return newOption;
    },
    [personOptions],
  );

  const value: EntryPageContextValue = useMemo(
    () => ({
      appState,
      storeOptions,
      productOptions,
      personOptions,
      dispatch,
      addStoreOption,
      addProductOption,
      addPersonOption,
    }),
    [
      addPersonOption,
      addProductOption,
      addStoreOption,
      appState,
      dispatch,
      personOptions,
      productOptions,
      storeOptions,
    ],
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
