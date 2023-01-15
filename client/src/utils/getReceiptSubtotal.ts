import { ReceiptType } from 'calculator/types';

export const getReceiptSubtotal = (receipt: ReceiptType): number => {
  return receipt.items.reduce((total, item) => total + item.price, 0);
};
