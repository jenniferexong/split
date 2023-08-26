import { ReceiptType } from '../calculator';

export const getReceiptSubtotal = (receipt: ReceiptType): number => {
  return receipt.items.reduce((total, item) => total + item.price, 0);
};
