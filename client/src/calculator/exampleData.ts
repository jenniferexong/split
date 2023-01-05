import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { ReceiptType } from './types';

export const countdown: ApiStore = {
  id: 1,
  name: 'Countdown',
};

export const pork: ApiProduct = {
  id: 1,
  name: 'Pork',
};

export const carrots: ApiProduct = {
  id: 2,
  name: 'Carrots',
};

export const apples: ApiProduct = {
  id: 3,
  name: 'Apples',
};

export const steak: ApiProduct = {
  id: 4,
  name: 'Steak',
};

export const adam: ApiPerson = {
  id: 1,
  firstName: 'Adam',
  lastName: 'Agar',
  email: 'adam.agar@email.com',
};

export const bob: ApiPerson = {
  id: 2,
  firstName: 'Bob',
  lastName: 'luza',
  email: 'bob.luza@email.com',
};

export const exampleReceipt = (
  person1: ApiPerson,
  person2: ApiPerson,
): ReceiptType => ({
  store: countdown,
  date: new Date('01-01-2023'),
  items: [
    {
      product: pork,
      splits: [
        { person: person1, antecedent: 1 },
        { person: person2, antecedent: 1 },
      ],
      price: 4.56,
    },
    {
      product: carrots,
      splits: [
        { person: person1, antecedent: 1 },
        { person: person2, antecedent: 1 },
      ],
      price: 2.69,
    },
    {
      product: apples,
      splits: [{ person: person1, antecedent: 1 }],
      price: 1.5,
    },
    {
      product: steak,
      splits: [{ person: person2, antecedent: 1 }],
      price: 10.4,
    },
  ],
  subtotal: 19.15,
});
