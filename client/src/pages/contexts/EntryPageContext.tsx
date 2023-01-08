import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { ProductOption, StoreOption } from 'components/input';
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

const convertProductToOption = (product: ApiProduct): ProductOption => ({
  label: product.name,
  data: product,
});

interface EntryPageContextValue {
  storeOptions: StoreOption[];
  productOptions: ProductOption[];
  // personOptions: PersonOption[];
  addStoreOption: (store: ApiStore) => StoreOption;
  addProductOption: (store: ApiProduct) => ProductOption;
  // addPersonOption: (store: ApiPerson) => void;
}

const EntryPageContext = createContext<EntryPageContextValue>({
  storeOptions: [],
  productOptions: [],
  // personOptions: [],
  addStoreOption: () => null as unknown as StoreOption,
  addProductOption: () => null as unknown as ProductOption,
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
  const { loadedStores, loadedProducts, children } = props;

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>(
    loadedStores.map(convertStoreToOption),
  );

  const [productOptions, setProductOptions] = useState<ProductOption[]>(
    loadedProducts.map(convertProductToOption),
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

  const value: EntryPageContextValue = useMemo(
    () => ({
      storeOptions,
      productOptions,
      addStoreOption,
      addProductOption,
    }),
    [addProductOption, addStoreOption, productOptions, storeOptions],
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
