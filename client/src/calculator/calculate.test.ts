import { calculate } from './calculate';
import {
  adam,
  apples,
  bob,
  carrots,
  countdown,
  exampleReceipt,
  steak,
} from './exampleData';
import { EntryData } from './types';

describe('calculate', () => {
  const data: EntryData = {
    people: [
      {
        person: adam,
        receipts: [
          {
            date: new Date('01-01-22'),
            store: countdown,
            items: [
              {
                product: apples,
                splits: [
                  { person: adam, antecedent: 1 },
                  { person: bob, antecedent: 1 },
                ],
                price: 550,
              },
              {
                product: apples,
                splits: [
                  { person: adam, antecedent: 1 },
                  { person: bob, antecedent: 1 },
                ],
                price: 440,
              },
              {
                product: apples,
                splits: [{ person: adam, antecedent: 1 }],
                price: 20.5,
              },
              {
                product: carrots,
                splits: [{ person: bob, antecedent: 1 }],
                price: 21.8,
              },
            ],
            sequence: 0,
          },
        ],
      },
      {
        person: bob,
        receipts: [
          {
            date: new Date('01-01-22'),
            store: countdown,
            items: [
              {
                product: steak,
                splits: [{ person: bob, antecedent: 1 }],
                price: 4.56,
              },
              {
                product: apples,
                splits: [{ person: adam, antecedent: 1 }],
                price: 2.69,
              },
              {
                product: carrots,
                splits: [{ person: bob, antecedent: 1 }],
                price: 1.5,
              },
              {
                product: apples,
                splits: [{ person: bob, antecedent: 1 }],
                price: 10.4,
              },
              {
                product: carrots,
                splits: [{ person: adam, antecedent: 1 }],
                price: 1.4,
              },
              {
                product: apples,
                splits: [
                  { person: adam, antecedent: 1 },
                  { person: bob, antecedent: 1 },
                ],
                price: 30.5,
              },
            ],
            sequence: 1,
          },
        ],
      },
    ],
  };

  describe('calculates the correct information', () => {
    test('case 1', () => {
      const { globalTotal, invoices } = calculate(data);

      expect(globalTotal).toBeCloseTo(1083.35);

      expect(invoices[0].totalSpendings).toBeCloseTo(534.84);
      expect(invoices[0].actualSpendings).toBeCloseTo(1032.3);
      expect(invoices[0].owings).toBe(0);

      expect(invoices[1].totalSpendings).toBeCloseTo(548.51);
      expect(invoices[1].actualSpendings).toBeCloseTo(51.05);
      expect(invoices[1].owings).toBeCloseTo(497.46);
      expect({ globalTotal, invoices }).toMatchSnapshot();
    });

    test('case 2', () => {
      const exampleData: EntryData = {
        people: [
          {
            person: adam,
            receipts: [exampleReceipt(adam, bob)],
          },
          {
            person: bob,
            receipts: [exampleReceipt(bob, adam)],
          },
        ],
      };

      const { globalTotal, invoices } = calculate(exampleData);

      expect(globalTotal).toBeCloseTo(38.3);
      expect(invoices[0].totalSpendings).toBeCloseTo(19.15);
      expect(invoices[0].actualSpendings).toBeCloseTo(19.15);
      expect(invoices[0].owings).toBe(0);

      expect(invoices[1].totalSpendings).toBeCloseTo(19.15);
      expect(invoices[1].actualSpendings).toBeCloseTo(19.15);
      expect(invoices[1].owings).toBe(0);

      expect({ globalTotal, invoices }).toMatchSnapshot();
    });
  });
});
