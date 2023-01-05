import { AppType, InvoiceData } from './types';

interface CalculateResult {
  globalTotal: number;
  /**
   * Record from person id to invoice
   */
  invoices: Record<number, InvoiceData>;
}

export const calculate = (data: AppType): CalculateResult => {
  let globalTotal = 0;

  // From person id to invoice data
  const invoices: Record<number, InvoiceData> = {
    [data.people[0].person.id]: {
      totalSpendings: 0,
      actualSpendings: 0,
      oweings: 0,
    },
    [data.people[1].person.id]: {
      totalSpendings: 0,
      actualSpendings: 0,
      oweings: 0,
    },
  };

  data.people.forEach(person => {
    person.receipts.forEach(receipt => {
      receipt.items.forEach(item => {
        const receiptPerson = person.person;
        const { price, splits } = item;

        globalTotal += price;
        invoices[receiptPerson.id].actualSpendings += price;

        const consequent = splits.reduce(
          (sum, split) => sum + split.antecedent,
          0,
        );

        splits.forEach(split => {
          const { person: splitPerson, antecedent } = split;

          const amount = (price / consequent) * antecedent;

          invoices[splitPerson.id].totalSpendings += amount;

          if (splitPerson !== receiptPerson) {
            invoices[splitPerson.id].oweings += amount;
            invoices[receiptPerson.id].oweings -= amount;
          }
        });
      });
    });
  });

  // NOTE this is only useful if there are two people (does not say who owes who)
  Object.values(invoices).forEach(invoice => {
    invoice.oweings = invoice.oweings < 0 ? 0 : invoice.oweings;
  });

  return { globalTotal, invoices };
};
