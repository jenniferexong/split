import { AppType } from 'calculator/types';

const appStateStorageKey = 'Split::AppState';

export const getStoredAppState = (): AppType | undefined => {
  const appStateJson = localStorage.getItem(appStateStorageKey);
  if (appStateJson) {
    const state = JSON.parse(appStateJson) as AppType;

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

export const setStoredAppState = (appState: AppType) => {
  localStorage.setItem(appStateStorageKey, JSON.stringify(appState));
};
