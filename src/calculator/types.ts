export type Whose = "mine" | "theirs" | "split";

export interface ItemType {
  title?: string;
  /** Should default to mine if not specified */
  whose: Whose;
  price: number;
}

export interface ReceiptType {
  title: string;
  items: ItemType[];
  subtotal: number;
}

export interface PersonType {
  name: string;
  receipts: ReceiptType[];
}
export interface AppType {
  people: PersonType[];
}
