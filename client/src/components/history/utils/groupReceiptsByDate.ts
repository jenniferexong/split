import moment from 'moment';
import { ApiReceipt } from '../../../api';

/**
 * Assumes @param receipts is already sorted by date.
 */
export const groupReceiptsByDate = (receipts: ApiReceipt[]): ApiReceipt[][] => {
  const groupedReceipts: ApiReceipt[][] = [];

  receipts.forEach((receipt, index) => {
    const previousReceipt = receipts[index - 1];
    if (
      !previousReceipt ||
      !moment(previousReceipt.date).isSame(receipt.date, 'date')
    ) {
      groupedReceipts.push([receipt]);
    } else {
      groupedReceipts[groupedReceipts.length - 1].push(receipt);
    }
  });

  return groupedReceipts;
};
