import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { EntryData } from 'calculator/types';
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
import { setStoredEntryData } from 'storage/entryData';
import { insertIntoSortedArray } from 'utils/insertIntoSortedArray';
import { noop } from 'utils/noop';
import { Action, initialState } from 'utils/reducer';

interface EntryPageContextValue {
  storeOptions: StoreOption[];
  productOptions: ProductOption[];
  personOptions: PersonOption[];
  entryData: EntryData;
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
  entryData: initialState,
  selectedPeople: [],
  dispatch: noop,
  addStoreOption: () => null as unknown as StoreOption,
  addProductOption: () => null as unknown as ProductOption,
  addPersonOption: () => null as unknown as PersonOption,
});

interface EntryPageContextProviderProps {
  children: ReactNode | ReactNode[];
  entryData: EntryData;
  loadedStores: ApiStore[];
  loadedProducts: ApiProduct[];
  loadedPeople: ApiPerson[];
  dispatch: Dispatch<Action>;
}

export const EntryPageContextProvider = (
  props: EntryPageContextProviderProps,
) => {
  const {
    entryData,
    loadedStores,
    loadedProducts,
    loadedPeople,
    children,
    dispatch,
  } = props;

  // Update local storage entry
  useEffect(() => {
    setStoredEntryData(entryData);
  }, [entryData]);

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
    () => entryData.people.map(person => person.person),
    [entryData.people],
  );

  const value: EntryPageContextValue = useMemo(
    () => ({
      entryData,
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
      entryData,
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
