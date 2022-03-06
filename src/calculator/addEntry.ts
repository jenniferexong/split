import { Entry, Receipt } from "./types";

export const addEntry = (entry: Entry, receipt: Receipt) => {
  receipt.entries.push(entry);
  receipt.subtotal += entry.price;
};

export const removeEntry = (entry: Entry, receipt: Receipt) => {
  receipt.entries = receipt.entries.filter((e) => e !== entry);
  receipt.subtotal -= entry.price;
};
