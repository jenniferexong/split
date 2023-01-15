import { ApiReceipt } from 'api';

interface PersonTotal {
  name: string;
  total: number;
}

// Indexed by person id
type PersonTotals = Record<number, PersonTotal>;

export const getPersonTotals = (receipt: ApiReceipt): PersonTotals => {
  const totals: PersonTotals = {};

  receipt.receiptLines.forEach(receiptLine => {
    receiptLine.splits.forEach(split => {
      const { person, amount } = split;

      const personTotal: PersonTotal | undefined = totals[person.id];
      if (personTotal) {
        totals[person.id].total += amount;
      } else {
        totals[person.id] = {
          name: person.firstName,
          total: amount,
        };
      }
    });
  });

  return totals;
};
