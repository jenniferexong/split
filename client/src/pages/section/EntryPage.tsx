import { calculate } from 'calculator';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { clearReceiptsAction, initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { useCreateReceipt, useDeleteReceipt } from 'api';

import pluralize from 'pluralize';
import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';
import { mapEntryDataToReceiptInputs, ReceiptInputs } from 'api/utils';
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
  const { deleteReceipt } = useDeleteReceipt();

  const [showCreatePersonModal, setShowCreatePersonModal] =
    useState<boolean>(false);

  const clearReceipts = useCallback((guard: boolean) => {
    if (guard) {
      const accepted = confirm('Clear receipts?');
      if (!accepted) return;
    }

    dispatch(clearReceiptsAction);
  }, []);

  const uploadReceipts = useCallback(async () => {
    if (getTotalReceipts(entryData) <= 0) {
      showError('No receipts to save', 'error-no-receipts-to-upload');
      return;
    }

    const accepted = confirm(
      'Are you sure? Receipts and invoices will be reset. This can not be undone.',
    );
    if (!accepted) return;

    let receiptInputs: ReceiptInputs;
    try {
      receiptInputs = mapEntryDataToReceiptInputs(entryData);
    } catch (error: any) {
      showError(
        `${(error as Error).message}`,
        'error-map-entry-data-to-receipt-inputs',
      );
      return;
    }

    const uploadedReceipts: number[] = [];
    let failures = 0;

    // create receipts
    await Promise.all(
      Object.entries(receiptInputs).map(async ([sequence, input]) => {
        try {
          const createdReceipt = await createReceipt(input);
          uploadedReceipts.push(createdReceipt.id);
        } catch (error: any) {
          showError(
            `Failed to upload receipt: ${(error as Error).message}`,
            `error-upload-receipt-${sequence}`,
          );
          failures++;
        }
      }),
    );

    if (failures) {
      // remove the added receipts from db to avoid adding duplicates when resubmitting
      uploadedReceipts.forEach(id => deleteReceipt(id));
      showError(
        `Failed to upload ${pluralize('receipt', failures, true)}`,
        'error-upload-receipts',
      );
      return;
    }

    showSuccess(
      `Successfully uploaded ${pluralize(
        'receipt',
        Object.keys(receiptInputs).length,
        true,
      )}`,
      'success-upload-receipts',
    );
    clearReceipts(false);
  }, [entryData, clearReceipts, createReceipt, deleteReceipt]);

  const footerButtons = useMemo(
    () => [
      {
        label: 'Create person',
        onClick: async () => setShowCreatePersonModal(true),
      },
      {
        label: 'Clear receipts',
        onClick: async () => clearReceipts(true),
      },
      {
        label: 'Save',
        onClick: uploadReceipts,
      },
    ],
    [clearReceipts, uploadReceipts],
  );

  useBottomTabBarMenu(footerButtons);

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
