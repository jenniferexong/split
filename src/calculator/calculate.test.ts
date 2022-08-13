import { calculate } from './calculate';
import { exampleReceipt } from './exampleData';
import { AppType } from './types';

describe('calculate', () => {
  const data: AppType = {
    people: [
      {
        name: 'Person 1',
        receipts: [
          {
            title: 'Countdown',
            items: [
              { title: '', whose: 'split', price: 550 },
              { title: '', whose: 'split', price: 440 },
              { title: '', whose: 'mine', price: 20.5 },
              { title: '', whose: 'theirs', price: 21.8 },
            ],
            // we don't care about subtotal for this
            subtotal: 0,
          },
        ],
      },
      {
        name: 'Person 2',
        receipts: [
          {
            title: 'New World',
            items: [
              { title: '', whose: 'mine', price: 4.56 },
              { title: '', whose: 'theirs', price: 2.69 },
              { title: '', whose: 'mine', price: 1.5 },
              { title: '', whose: 'mine', price: 10.4 },
              { title: '', whose: 'theirs', price: 1.4 },
              { title: '', whose: 'split', price: 30.5 },
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
      const result = calculate(data);
      expect(result.globalTotal).toBeCloseTo(1083.35);

      expect(result.invoices[0].totalSpendings).toBeCloseTo(534.84);
      expect(result.invoices[0].actualSpendings).toBeCloseTo(1032.3);
      expect(result.invoices[0].oweings).toBe(0);

      expect(result.invoices[1].totalSpendings).toBeCloseTo(548.51);
      expect(result.invoices[1].actualSpendings).toBeCloseTo(51.05);
      expect(result.invoices[1].oweings).toBeCloseTo(497.46);
      expect(result).toMatchSnapshot();
    });

    test('case 2', () => {
      const exampleData = {
        people: [
          {
            name: 'Person 1',
            receipts: [exampleReceipt],
          },
          {
            name: 'Person 2',
            receipts: [exampleReceipt],
          },
        ],
      };
      const result = calculate(exampleData);

      expect(result.globalTotal).toBeCloseTo(38.3);
      expect(result.invoices[0].totalSpendings).toBeCloseTo(19.15);
      expect(result.invoices[0].actualSpendings).toBeCloseTo(19.15);
      expect(result.invoices[0].oweings).toBe(0);

      expect(result.invoices[1].totalSpendings).toBeCloseTo(19.15);
      expect(result.invoices[1].actualSpendings).toBeCloseTo(19.15);
      expect(result.invoices[1].oweings).toBe(0);

      expect(result).toMatchSnapshot();
    });
  });
});
