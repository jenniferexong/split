export interface Person {
  name: string;
}

export interface EntryType {
  title?: string;
  /** Should default to mine if not specified */
  whose: "mine" | "theirs" | "split";
  price: number;
}

export interface ReceiptType {
  title: string;
  entries: EntryType[];
  subtotal: number;
}
