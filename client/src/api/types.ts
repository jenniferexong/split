export interface ApiProduct {
  id: number;
  name: string;
}

export interface ApiStore {
  id: number;
  name: string;
}

export interface ApiPerson {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiReceiptLineSplit {
  id: number;
  person: ApiPerson;
  amount: number;
}

export interface ApiReceiptLine {
  id: number;
  price: number;
  product: ApiProduct;
  splits: ApiReceiptLineSplit[];
}

export interface ApiReceipt {
  id: number;
  date: Date;
  store: ApiStore;
  paidBy: ApiPerson;
  receiptLines: ApiReceiptLine[];
}
