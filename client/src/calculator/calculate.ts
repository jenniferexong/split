import { hasSelectedAllPeople } from '../utils/hasSelectedAllPeople';
import { AppType, InvoiceData } from './types';

interface CalculateResult {
  globalTotal: number;
  /**
   * In the same order of people in the app
   */
  invoices: InvoiceData[];
}

export const calculate = (data: AppType): CalculateResult => {
  let globalTotal = 0;

  const invoices: InvoiceData[] = data.people.map(person => ({
    person: person.person,
    totalSpendings: 0,
    actualSpendings: 0,
    oweings: 0,
  }));

  if (!hasSelectedAllPeople(data.people.map(person => person.person))) {
    return {
      globalTotal: 0,
      invoices,
    };
  }

  data.people.forEach((person, personIndex) => {
    person.receipts.forEach(receipt => {
      receipt.items.forEach(item => {
        const receiptPerson = person.person;
        const { price, splits } = item;

        globalTotal += price;
        invoices[personIndex].actualSpendings += price;

        const consequent = splits.reduce(
          (sum, split) => sum + split.antecedent,
          0,
        );

        splits.forEach(split => {
          const { person: splitPerson, antecedent } = split;

          const amount = (price / consequent) * antecedent;

          const splitPersonIndex = data.people.findIndex(
            person => person.person?.id === splitPerson.id,
          );

          invoices[splitPersonIndex].totalSpendings += amount;

          if (splitPerson !== receiptPerson) {
            invoices[personIndex ^ 1].oweings += amount;
            invoices[personIndex].oweings -= amount;
          }
        });
      });
    });
  });

  // NOTE this is only useful if there are two people (does not say who owes who)
  invoices.forEach(invoice => {
    invoice.oweings = invoice.oweings < 0 ? 0 : invoice.oweings;
  });

  return { globalTotal, invoices };
};
