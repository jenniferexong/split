import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { AppType } from 'calculator/types';
import {
  mapPersonToOption,
  mapProductToOption,
  mapStoreToOption,
  PersonOption,
  ProductOption,
  StoreOption,
} from 'components/input';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setStoredAppState } from 'storage/appState';
import { insertIntoSortedArray } from 'utils/insertIntoSortedArray';
import { noop } from 'utils/noop';
import { Action, initialState } from 'utils/reducer';

interface EntryPageContextValue {
  storeOptions: StoreOption[];
  productOptions: ProductOption[];
  personOptions: PersonOption[];
  appState: AppType;
  selectedPeople: (ApiPerson | undefined)[];
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
  selectedPeople: [],
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

  // Update local storage entry
  useEffect(() => {
    setStoredAppState(appState);
  }, [appState]);

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>(
    loadedStores.map(mapStoreToOption),
  );

  const [productOptions, setProductOptions] = useState<ProductOption[]>(
    loadedProducts.map(mapProductToOption),
  );

  const [personOptions, setPersonOptions] = useState<PersonOption[]>(
    loadedPeople.map(mapPersonToOption),
  );

  const addStoreOption = useCallback(
    (store: ApiStore): StoreOption => {
      const newOption = mapStoreToOption(store);

      setStoreOptions(
        insertIntoSortedArray(storeOptions, newOption, option =>
          option.label.toLowerCase(),
        ),
      );

      return newOption;
    },
    [storeOptions],
  );

  const addProductOption = useCallback(
    (product: ApiProduct): ProductOption => {
      const newOption = mapProductToOption(product);

      setProductOptions(
        insertIntoSortedArray(productOptions, newOption, option =>
          option.label.toLowerCase(),
        ),
      );

      return newOption;
    },
    [productOptions],
  );

  const addPersonOption = useCallback(
    (person: ApiPerson): PersonOption => {
      const newOption = mapPersonToOption(person);

      setPersonOptions(
        insertIntoSortedArray(personOptions, newOption, option =>
          option.label.toLowerCase(),
        ),
      );

      return newOption;
    },
    [personOptions],
  );

  const selectedPeople = useMemo(
    () => appState.people.map(person => person.person),
    [appState.people],
  );

  const value: EntryPageContextValue = useMemo(
    () => ({
      appState,
      storeOptions,
      productOptions,
      personOptions,
      selectedPeople,
      dispatch,
      addStoreOption,
      addProductOption,
      addPersonOption,
    }),
    [
      addPersonOption,
      addProductOption,
      addStoreOption,
      dispatch,
      appState,
      selectedPeople,
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
