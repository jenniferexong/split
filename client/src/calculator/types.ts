import { ApiPerson, ApiProduct, ApiStore } from 'api';

export type Whose = 'mine' | 'split' | 'theirs';

export interface SplitType {
  person: ApiPerson;
  antecedent: number;
}

export interface ItemType {
  product: ApiProduct | undefined;
  splits: SplitType[];
  price: number;
}

export interface ReceiptType {
  store: ApiStore | undefined;
  date: Date | undefined;
  items: ItemType[];
  subtotal: number;
}

export interface PersonType {
  person?: ApiPerson;
  receipts: ReceiptType[];
  image?: string;
}

export interface AppType {
  people: PersonType[];
}

export interface InvoiceData {
  person: ApiPerson | undefined;
  totalSpendings: number;
  actualSpendings: number;
  oweings: number;
}
