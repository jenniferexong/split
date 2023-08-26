import { ApiPerson, ApiProduct, ApiReceipt, ApiStore } from '../api';

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

export interface HistoryPageData {
  receipts: ApiReceipt[];
}
