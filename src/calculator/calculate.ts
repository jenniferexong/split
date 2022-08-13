import { unreachable } from '../utils/unreachable';
import { AppType, InvoiceData } from './types';

interface CalculateResult {
  globalTotal: number;
  /** In the same order of people in the app */
  invoices: InvoiceData[];
}

export const calculate = (data: AppType): CalculateResult => {
  let globalTotal = 0;

  const invoices: InvoiceData[] = [
    {
      totalSpendings: 0,
      actualSpendings: 0,
      oweings: 0,
    },
    {
      totalSpendings: 0,
      actualSpendings: 0,
      oweings: 0,
    },
  ];

  data.people.forEach((person, personIndex) => {
    person.receipts.forEach(receipt => {
      receipt.items.forEach(item => {
        const { price, whose } = item;

        globalTotal += price;
        invoices[personIndex].actualSpendings += price;

        switch (whose) {
          case 'mine': {
            invoices[personIndex].totalSpendings += price;
            break;
          }
          case 'theirs': {
            invoices[personIndex ^ 1].totalSpendings += price;
            invoices[personIndex ^ 1].oweings += price;
            invoices[personIndex].oweings -= price;
            break;
          }
          case 'split': {
            const splitCost = price / 2;
            invoices[personIndex].totalSpendings += splitCost;
            invoices[personIndex ^ 1].totalSpendings += splitCost;
            invoices[personIndex ^ 1].oweings += splitCost;
            invoices[personIndex].oweings -= splitCost;
            break;
          }
          default: {
            unreachable(whose);
          }
        }
      });
    });
  });

  invoices.forEach(invoice => {
    invoice.oweings = invoice.oweings < 0 ? 0 : invoice.oweings;
  });

  return { globalTotal, invoices };
};
