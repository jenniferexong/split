import { calculate } from 'calculator';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { clearReceiptsAction, initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { useCreateReceipt } from 'api';

import pluralize from 'pluralize';
import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';
import { mapEntryDataToReceiptInputs } from 'api/utils';
import { showError, showSuccess } from 'utils/showToast';
import { getStoredEntryData } from 'storage/entryData';
import { CreatePersonModal } from 'components/entry/CreatePersonModal';
import { getTotalReceipts } from 'utils/getTotalReceipts';

export const EntryPage = () => {
  const {
    stores: loadedStores,
    products: loadedProducts,
    people: loadedPeople,
  } = useLoaderData() as EntryPageData;

  const [entryData, dispatch] = useReducer(
    reducer,
    getStoredEntryData() || initialState,
  );
  const { createReceipt } = useCreateReceipt();

  const [showCreatePersonModal, setShowCreatePersonModal] =
    useState<boolean>(false);

  const clearReceipts = (guard: boolean) => {
    if (guard) {
      const accepted = confirm('Clear receipts?');
      if (!accepted) return;
    }

    dispatch(clearReceiptsAction);
  };

  const uploadReceipts = useCallback(() => {
    if (getTotalReceipts(entryData) <= 0) {
      showError('No receipts to save');
      return;
    }

    const accepted = confirm('Upload receipts? This cannot be undone.');
    if (!accepted) return;

    try {
      const receiptInputs = mapEntryDataToReceiptInputs(entryData);

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
  }, [entryData, createReceipt]);

  useBottomTabBarMenu([
    {
      label: 'Create person',
      onClick: () => setShowCreatePersonModal(true),
    },
    {
      label: 'Clear receipts',
      onClick: () => clearReceipts(true),
    },
    {
      label: 'Save',
      onClick: uploadReceipts,
    },
  ]);

  const calculations = useMemo(() => calculate(entryData), [entryData]);
  const closeModal = useCallback(() => {
    setShowCreatePersonModal(false);
  }, []);

  return (
    <EntryPageContextProvider
      entryData={entryData}
      loadedPeople={loadedPeople}
      loadedProducts={loadedProducts}
      loadedStores={loadedStores}
      dispatch={dispatch}
    >
      {entryData.people.map((person, index) => (
        <PersonBoard
          key={index}
          person={person}
          personIndex={index}
          invoice={calculations.invoices[index]}
        />
      ))}
      <CreatePersonModal
        show={showCreatePersonModal}
        handleClose={closeModal}
      />
    </EntryPageContextProvider>
  );
};
EntryPage.displayName = 'EntryPage';
