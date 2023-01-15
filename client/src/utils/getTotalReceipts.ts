import { EntryData } from 'calculator/types';

export const getTotalReceipts = (entryData: EntryData): number =>
  entryData.people.reduce((count, person) => count + person.receipts.length, 0);
