import { calculate } from 'calculator';
import { useCallback, useMemo, useReducer } from 'react';
import { clearAction, initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { ApiPerson, useCreateReceipt } from 'api';

import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';
import { mapAppStateToReceiptInputs } from 'api/utils';
import { showError, showSuccess } from 'utils/showToast';

export const EntryPage = () => {
  const {
    stores: loadedStores,
    products: loadedProducts,
    people: loadedPeople,
  } = useLoaderData() as EntryPageData;

  // TODO get and store in local storage (preserve data while changing tabs)
  const [appState, dispatch] = useReducer(reducer, initialState);
  const { createReceipt } = useCreateReceipt();

  const people: (ApiPerson | undefined)[] = useMemo(
    () => appState.people.map(person => person.person),
    [appState.people],
  );

  // TODO clear from local storage
  const clearReceipts = () => {
    dispatch(clearAction);
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

      // TODO await receipt creation?
      showSuccess(`Successfully uploaded ${receiptInputs.length} receipts!`);
      clearReceipts();
    } catch (e: any) {
      showError(e.toString());
    }
  }, [appState, createReceipt]);

  useBottomTabBarMenu([
    {
      label: 'Clear',
      onClick: clearReceipts,
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
          people={people}
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
