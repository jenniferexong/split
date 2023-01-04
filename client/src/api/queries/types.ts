import { ApiProduct, ApiReceipt, ApiPerson, ApiStore } from 'api';

export interface QueryResult<T> {
  data?: T;
  fetching: boolean;
}

export interface ProductResult {
  product: ApiProduct;
}

export interface ProductsResult {
  products: ApiProduct[];
}

export interface StoreResult {
  store: ApiStore;
}

export interface StoresResult {
  stores: ApiStore[];
}

export interface PeopleResult {
  people: ApiPerson[];
}

export interface PersonResult {
  person: ApiPerson;
}

export interface ReceiptResult {
  receipt: ApiReceipt;
}

export interface ReceiptsResult {
  receipts: ApiReceipt[];
}
