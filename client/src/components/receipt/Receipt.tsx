import { ReceiptType } from 'calculator/types';
import { Button } from 'components/button';
import { Entry as Item } from 'components/item';
import { Dispatch, useCallback, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { getLastAddedCell, Table, TableCell, TableRow } from 'components/table';
import { Action } from 'utils/reducer';
import { Barcode } from './Barcode';
import { Paper } from 'components/board';
import { Container } from './Container';
import { useCreateStore } from 'api';
import Creatable from 'react-select/creatable';
import { ActionMeta } from 'react-select';
import { StoreOption } from 'pages/types';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';

const getStoreOptionValue = (option: StoreOption) => option.label;

const StyledReceipt = styled(Paper)`
  grid-column: span 2;
`;

interface ReceiptProps {
  personIndex: number;
  receiptIndex: number;
  receipt: ReceiptType;
  dispatch: Dispatch<Action>;
}

export const Receipt = (props: ReceiptProps) => {
  const {
    personIndex,
    receiptIndex,
    dispatch,
    receipt: { items, subtotal },
  } = props;

  const { storeOptions, addStoreOption } = useEntryPageContext();
  const { createStore } = useCreateStore();
  const [storeOptionValue, setStoreOptionValue] =
    useState<StoreOption | null>();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const handleAddItem = () => {
    dispatch({
      type: 'addItem',
      personIndex,
      receiptIndex,
    });

    setTimeout(() => {
      getLastAddedCell(buttonRef.current)?.focus();
    }, 0);
  };

  const handleCreateOption = useCallback(
    (inputValue: string) => {
      createStore(inputValue).then(store => {
        // Updates store options
        const newOption = addStoreOption(store);

        dispatch({
          type: 'updateReceipt',
          personIndex,
          receiptIndex,
          receipt: { store, items, subtotal, date: undefined }, // TODO date
        });

        setStoreOptionValue(newOption);
      });
    },
    [
      addStoreOption,
      createStore,
      dispatch,
      items,
      personIndex,
      receiptIndex,
      subtotal,
    ],
  );

  const handleChangeOption = useCallback(
    (option: StoreOption | null, actionMeta: ActionMeta<StoreOption>) => {
      if (actionMeta.action === 'select-option') {
        dispatch({
          type: 'updateReceipt',
          personIndex,
          receiptIndex,
          receipt: { store: option?.data, items, subtotal, date: undefined }, // TODO date
        });
      }
    },
    [dispatch, items, personIndex, receiptIndex, subtotal],
  );

  return (
    <StyledReceipt width={theme.components.receipt.width}>
      <Container>
        <Table>
          <thead>
            <TableRow borderBottom>
              <TableCell colSpan={3} as="th" textAlign="center">
                {/* TODO extract to own component? */}
                <Creatable
                  placeholder="Untitled"
                  options={storeOptions}
                  value={storeOptionValue}
                  getOptionValue={getStoreOptionValue}
                  onChange={handleChangeOption}
                  onCreateOption={handleCreateOption}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                />
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <Item
                key={`${personIndex}-${receiptIndex}-${index}`}
                personIndex={personIndex}
                receiptIndex={receiptIndex}
                itemIndex={index}
                dispatch={dispatch}
                {...item}
              />
            ))}
            <TableRow borderBottom borderTop={items.length === 0}>
              <td colSpan={3}>
                <Button ref={buttonRef} onClick={handleAddItem}>
                  +
                </Button>
              </td>
            </TableRow>
            <TableRow borderTop>
              <TableCell colSpan={2}>Item count:</TableCell>
              <TableCell textAlign="right">{items.length}</TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2}>
                <b>Total:</b>
              </TableCell>
              <TableCell textAlign="right">
                <b>${subtotal.toFixed(2)}</b>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
        <Barcode />
      </Container>
    </StyledReceipt>
  );
};
Receipt.displayText = 'Receipt';
