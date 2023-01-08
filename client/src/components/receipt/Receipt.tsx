import { ReceiptType } from 'calculator/types';
import { Button } from 'components/button';
import { Entry as Item } from 'components/item';
import { Dispatch, useCallback, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  focusTableCell,
  getLastAddedCell,
  Table,
  TableCell,
  TableRow,
} from 'components/table';
import { Action } from 'utils/reducer';
import { Barcode } from './Barcode';
import { Paper } from 'components/board';
import { Container } from './Container';
import { ApiPerson, useCreateStore } from 'api';
import { ActionMeta } from 'react-select';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import { Select, StoreOption } from 'components/select';

const StyledReceipt = styled(Paper)`
  grid-column: span 2;
`;

interface ReceiptProps {
  people: ApiPerson[];
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
    people,
  } = props;

  const { storeOptions, addStoreOption } = useEntryPageContext();
  const { createStore } = useCreateStore();
  const [storeOptionValue, setStoreOptionValue] = useState<StoreOption | null>(
    null,
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const handleAddItem = () => {
    dispatch({
      type: 'addItem',
      personIndex,
      receiptIndex,
    });

    setTimeout(() => {
      focusTableCell(getLastAddedCell(buttonRef.current));
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

        setStoreOptionValue(option);
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
                <Select
                  placeholder="Untitled"
                  options={storeOptions}
                  value={storeOptionValue}
                  onChangeOption={handleChangeOption}
                  onCreateOption={handleCreateOption}
                />
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
            <TableRow borderTop>
              <TableCell colSpan={2}>Date</TableCell>
              <TableCell colSpan={2}>01-01-22</TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell bold colSpan={2}>
                Paid by
              </TableCell>
              <TableCell bold colSpan={2} textAlign="right">
                {people[personIndex].firstName}
              </TableCell>
            </TableRow>
            {items.map((item, index) => (
              <Item
                people={people}
                key={`${personIndex}-${receiptIndex}-${index}`}
                personIndex={personIndex}
                receiptIndex={receiptIndex}
                itemIndex={index}
                dispatch={dispatch}
                {...item}
              />
            ))}
            <TableRow borderBottom borderTop={items.length === 0}>
              <TableCell colSpan={3}>
                <Button ref={buttonRef} onClick={handleAddItem}>
                  +
                </Button>
              </TableCell>
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
