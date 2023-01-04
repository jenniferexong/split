import { CreateReceiptInput } from 'api';

export const createReceiptInput: CreateReceiptInput = {
  storeId: 1,
  personId: 1,
  date: new Date(),
  receiptLines: [
    {
      productId: 1,
      price: 10000,
      receiptLineSplits: [
        {
          personId: 1,
          antecedent: 1,
        },
        {
          personId: 2,
          antecedent: 2,
        },
      ],
    },
    {
      productId: 5,
      price: 99999,
      receiptLineSplits: [
        {
          personId: 1,
          antecedent: 1,
        },
      ],
    },
  ],
};
