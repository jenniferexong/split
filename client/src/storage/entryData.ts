import { EntryData } from '../calculator';

const entryDataStorageKey = 'Split::EntryData';

export const getStoredEntryData = (): EntryData | undefined => {
  const entryDataJson = localStorage.getItem(entryDataStorageKey);
  if (entryDataJson) {
    const state = JSON.parse(entryDataJson) as EntryData;

    // Convert date strings back to date objects
    state.people.forEach(person =>
      person.receipts.forEach(receipt => {
        if (receipt.date) {
          receipt.date = new Date(receipt.date?.toString());
        }
      }),
    );

    return state;
  }

  return undefined;
};

export const setStoredEntryData = (entryData: EntryData) => {
  localStorage.setItem(entryDataStorageKey, JSON.stringify(entryData));
};
