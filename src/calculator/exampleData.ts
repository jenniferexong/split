import { AppType, ReceiptType } from './types';

export const exampleReceipt: ReceiptType = {
  title: 'Countdown',
  items: [
    { title: 'Pork', whose: 'split', price: 4.56 },
    {
      title: 'Carrots',
      whose: 'split',
      price: 2.69,
    },
    {
      title: 'Apples',
      whose: 'mine',
      price: 1.5,
    },
    {
      title: '',
      whose: 'theirs',
      price: 10.4,
    },
  ],
  subtotal: 19.15,
};

export const testData: AppType = {
  people: [
    {
      name: 'Jennifer',
      receipts: [
        {
          title: 'Seasons Market',
          items: [
            {
              title: 'cucumbers',
              whose: 'split',
              price: 5,
            },
            {
              title: 'spring onion',
              whose: 'split',
              price: 1.99,
            },
          ],
          subtotal: 6.99,
        },
        {
          title: 'Countdown',
          items: [
            {
              title: 'berries',
              whose: 'mine',
              price: 18,
            },
            {
              title: 'strawberies',
              whose: 'theirs',
              price: 7,
            },
            {
              title: 'rubbish bags',
              whose: 'split',
              price: 5.49,
            },
            {
              title: 'butter',
              whose: 'mine',
              price: 8.5,
            },
          ],
          subtotal: 38.99,
        },
      ],
    },
    {
      name: 'Andy',
      receipts: [
        {
          title: 'Greens',
          items: [
            {
              title: 'choy sum',
              whose: 'split',
              price: 11.96,
            },
          ],
          subtotal: 11.96,
        },
        {
          title: 'Countdown',
          items: [
            {
              title: 'mushrooms',
              whose: 'mine',
              price: 4.24,
            },
            {
              title: 'chicken',
              whose: 'split',
              price: 16,
            },
            {
              title: 'bacon',
              whose: 'split',
              price: 5,
            },
            {
              title: 'flour',
              whose: 'split',
              price: 2,
            },
            {
              title: 'cheese',
              whose: 'split',
              price: 11,
            },
            {
              title: 'pork loin',
              whose: 'split',
              price: 15,
            },
            {
              title: 'chicken stock',
              whose: 'split',
              price: 2.5,
            },
            {
              title: 'sponges',
              whose: 'split',
              price: 4,
            },
            {
              title: 'capsicum',
              whose: 'split',
              price: 2.99,
            },
            {
              title: 'all spice',
              whose: 'split',
              price: 2.1,
            },
            {
              title: 'rice',
              whose: 'split',
              price: 7,
            },
            {
              title: 'eggs',
              whose: 'split',
              price: 11.8,
            },
          ],
          subtotal: 83.63,
        },
        {
          title: 'Tai Ping',
          items: [
            {
              title: 'buns',
              whose: 'split',
              price: 20.97,
            },
            {
              title: 'cucumber',
              whose: 'split',
              price: 1.99,
            },
            {
              title: 'mushrooms',
              whose: 'split',
              price: 12.99,
            },
            {
              title: 'carrots',
              whose: 'split',
              price: 1.24,
            },
            {
              title: 'lgm black bean',
              whose: 'mine',
              price: 10.99,
            },
            {
              title: 'lgm pork',
              whose: 'theirs',
              price: 6.99,
            },
            {
              title: 'hotpot seasoning',
              whose: 'split',
              price: 5.39,
            },
            {
              title: 'lamb slices',
              whose: 'split',
              price: 27.98,
            },
            {
              title: 'fish balls',
              whose: 'split',
              price: 3.99,
            },
            {
              title: 'fish tofu',
              whose: 'split',
              price: 7,
            },
            {
              title: 'tripe',
              whose: 'mine',
              price: 13.98,
            },
            {
              title: 'spring onion',
              whose: 'split',
              price: 1.99,
            },
          ],
          subtotal: 115.5,
        },
      ],
    },
  ],
};
