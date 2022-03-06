export interface Person {
  name: string;
}

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
