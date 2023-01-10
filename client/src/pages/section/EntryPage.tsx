import { calculate } from 'calculator';
import { useCallback, useMemo, useReducer } from 'react';
import { clearReceiptsAction, initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { useCreateReceipt } from 'api';

import pluralize from 'pluralize';
import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';
import { mapAppStateToReceiptInputs } from 'api/utils';
import { showError, showSuccess } from 'utils/showToast';
import { getStoredAppState } from 'storage/appState';

export const EntryPage = () => {
  const {
    stores: loadedStores,
    products: loadedProducts,
    people: loadedPeople,
  } = useLoaderData() as EntryPageData;

  const [appState, dispatch] = useReducer(
    reducer,
    getStoredAppState() || initialState,
  );
  const { createReceipt } = useCreateReceipt();

  const clearReceipts = (guard: boolean) => {
    if (guard) {
      const accepted = confirm('Clear receipts?');
      if (!accepted) return;
    }

    dispatch(clearReceiptsAction);
  };

  const uploadReceipts = useCallback(() => {
    const accepted = confirm('Upload receipts? This cannot be undone.');
    if (!accepted) return;

    try {
      const receiptInputs = mapAppStateToReceiptInputs(appState);

      // create receipts
      receiptInputs.forEach(input => {
        createReceipt(input);
      });

      showSuccess(
        `Successfully uploaded ${pluralize(
          'receipt',
          receiptInputs.length,
          true,
        )}!`,
      );
      clearReceipts(false);
    } catch (e: any) {
      showError(e.toString());
    }
  }, [appState, createReceipt]);

  useBottomTabBarMenu([
    {
      label: 'Clear receipts',
      onClick: () => clearReceipts(true),
    },
    {
      label: 'Save',
      onClick: uploadReceipts,
    },
  ]);

  const calculations = useMemo(() => calculate(appState), [appState]);

  return (
    <EntryPageContextProvider
      appState={appState}
      loadedPeople={loadedPeople}
      loadedProducts={loadedProducts}
      loadedStores={loadedStores}
      dispatch={dispatch}
    >
      {appState.people.map((person, index) => (
        <PersonBoard
          key={index}
          person={person}
          personIndex={index}
          invoice={calculations.invoices[index]}
        />
      ))}
    </EntryPageContextProvider>
  );
};
EntryPage.displayName = 'EntryPage';
