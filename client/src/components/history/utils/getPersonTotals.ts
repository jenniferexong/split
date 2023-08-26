import { ApiReceipt } from '../../../api';
import { PersonTotal, PersonTotals } from './types';

export const getPersonTotalsForReceipt = (
  receipt: ApiReceipt,
): PersonTotals => {
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

export const getPersonTotalsForReceipts = (
  receipts: ApiReceipt[],
): PersonTotals => {
  const combinedTotals: PersonTotals = {};

  const allPersonTotals: PersonTotals[] = receipts.map(receipt =>
    getPersonTotalsForReceipt(receipt),
  );

  allPersonTotals.forEach(personTotals => {
    Object.entries(personTotals).forEach(([id, personTotal]) => {
      const personId = parseInt(id);
      const personCombinedTotal: PersonTotal | undefined =
        combinedTotals[personId];

      if (personCombinedTotal) {
        combinedTotals[personId].total += personTotal.total;
      } else {
        combinedTotals[personId] = personTotal;
      }
    });
  });

  return combinedTotals;
};
