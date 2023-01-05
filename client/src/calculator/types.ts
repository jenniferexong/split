import { ApiPerson, ApiProduct, ApiStore } from 'api';

interface SplitType {
  person: ApiPerson;
  antecedent: number;
}

export interface ItemType {
  product: ApiProduct;
  splits: SplitType[];
  price: number;
}

export interface ReceiptType {
  store: ApiStore;
  date: Date;
  items: ItemType[];
  subtotal: number;
}

export interface PersonType {
  person: ApiPerson;
  receipts: ReceiptType[];
  image?: string;
}

export interface AppType {
  people: PersonType[];
}

export interface InvoiceData {
  totalSpendings: number;
  actualSpendings: number;
  oweings: number;
}
