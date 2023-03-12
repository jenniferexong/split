import { hasSelectedAllPeople } from '../utils/hasSelectedAllPeople';
import { EntryData, InvoiceData } from './types';

interface CalculateResult {
  globalTotal: number;
  /**
   * In the same order of people in the app
   */
  invoices: InvoiceData[];
}

export const calculate = (data: EntryData): CalculateResult => {
  let globalTotal = 0;

  const invoices: InvoiceData[] = data.people.map(person => ({
    person: person.person,
    totalSpendings: 0,
    actualSpendings: 0,
    owings: 0,
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
        });
      });
    });
  });

  // NOTE this is only useful if there are two people (does not say who owes who)
  invoices.forEach(invoice => {
    const { actualSpendings, totalSpendings } = invoice;
    invoice.owings =
      actualSpendings > totalSpendings ? 0 : totalSpendings - actualSpendings;
  });

  return { globalTotal, invoices };
};
