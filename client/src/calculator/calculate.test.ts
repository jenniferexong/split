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
import { AppType } from './types';

describe('calculate', () => {
  const data: AppType = {
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
            // we don't care about subtotal for this
            subtotal: 0,
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
            // we don't care about subtotal for this
            subtotal: 0,
          },
        ],
      },
    ],
  };

  describe('calculates the correct information', () => {
    test('case 1', () => {
      const { globalTotal, invoices } = calculate(data);

      expect(globalTotal).toBeCloseTo(1083.35);

      expect(invoices[adam.id].totalSpendings).toBeCloseTo(534.84);
      expect(invoices[adam.id].actualSpendings).toBeCloseTo(1032.3);
      expect(invoices[adam.id].oweings).toBe(0);

      expect(invoices[bob.id].totalSpendings).toBeCloseTo(548.51);
      expect(invoices[bob.id].actualSpendings).toBeCloseTo(51.05);
      expect(invoices[bob.id].oweings).toBeCloseTo(497.46);
      expect({ globalTotal, invoices }).toMatchSnapshot();
    });

    test('case 2', () => {
      const exampleData: AppType = {
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
      expect(invoices[adam.id].totalSpendings).toBeCloseTo(19.15);
      expect(invoices[adam.id].actualSpendings).toBeCloseTo(19.15);
      expect(invoices[adam.id].oweings).toBe(0);

      expect(invoices[bob.id].totalSpendings).toBeCloseTo(19.15);
      expect(invoices[bob.id].actualSpendings).toBeCloseTo(19.15);
      expect(invoices[bob.id].oweings).toBe(0);

      expect({ globalTotal, invoices }).toMatchSnapshot();
    });
  });
});
