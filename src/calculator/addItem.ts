import { ItemType, ReceiptType } from "./types";

/**
 * Returns new receipt with added item
 */
export const addItem = (item: ItemType, receipt: ReceiptType): ReceiptType => {
  const newReceipt = { ...receipt };

  newReceipt.items.push(item);
  newReceipt.subtotal += item.price;
  return newReceipt;
};

export const removeItem = (item: ItemType, receipt: ReceiptType) => {
  receipt.items = receipt.items.filter((e) => e !== item);
  receipt.subtotal -= item.price;
};
