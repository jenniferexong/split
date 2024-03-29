import { ApiPerson, ApiProduct, ApiReceipt, ApiStore } from '../types';

export type QueryResult<T> = () => Promise<T>;

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

export interface DeleteReceiptResult {
  deletedReceipt: ApiReceipt;
}

export interface ReceiptsResult {
  receipts: ApiReceipt[];
}
