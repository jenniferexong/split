import { AppType } from 'calculator/types';

export const getTotalReceipts = (appState: AppType): number =>
  appState.people.reduce((count, person) => count + person.receipts.length, 0);
