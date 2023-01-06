import { ApiPerson, ApiProduct, ApiStore } from 'api';

export enum PageUrl {
  Entry = '/entry',
  History = '/history',
  Analytics = '/analytics',
  CreateProduct = '/products/:name/create',
}

export interface EntryPageData {
  people: ApiPerson[];
  stores: ApiStore[];
  products: ApiProduct[];
}

export interface StoreOption {
  label: string;
  data: ApiStore;
}

export interface ProductOption {
  label: string;
  data: ApiProduct;
}

export interface PersonOption {
  label: string;
  data: ApiPerson;
}
