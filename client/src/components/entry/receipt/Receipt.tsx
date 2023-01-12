import { ReceiptType } from 'calculator/types';
import { Button, DeleteButton } from 'components/button';
import { Item } from '../item';
import { useCallback, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  focusTableCell,
  getLastAddedCell,
  Table,
  TableCell,
  TableRow,
} from 'components/table';
import { Barcode } from './Barcode';
import { Paper } from 'components/board';
import { Container } from './Container';
import { ApiPerson, useCreateStore } from 'api';
import { ActionMeta } from 'react-select';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import { DatePicker, CreateableSelect, StoreOption } from 'components/input';
import { useOptionValue, mapStoreToOption } from 'components/input/utils/';
import { usePositionReceipt } from './utils/usePositionReceipt';

const StyledReceipt = styled(Paper)<{ xOffset: number }>`
  position: relative;
  grid-column: span 2;
  left: ${props => props.xOffset}px;
`;

interface ReceiptProps {
  people: ApiPerson[];
  personIndex: number;
  receiptIndex: number;
  receipt: ReceiptType;
}

const RemoveReceiptButton = styled(DeleteButton)`
  font-size: 20px;
  position: absolute;
  top: -8px;
  right: 0;
`;

export const Receipt = (props: ReceiptProps) => {
  const { personIndex, receiptIndex, receipt, people } = props;

  const { storeOptions, addStoreOption, dispatch } = useEntryPageContext();
  const { createStore } = useCreateStore();
  const [storeOptionValue, setStoreOptionValue] = useOptionValue(
    receipt.store,
    mapStoreToOption,
  );

  const [showRemoveButton, setShowRemoveButton] = useState<boolean>(true);

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
          receipt: { ...receipt, store },
        });

        setStoreOptionValue(newOption);
      });
    },
    [
      addStoreOption,
      createStore,
      dispatch,
      personIndex,
      receipt,
      receiptIndex,
      setStoreOptionValue,
    ],
  );

  const handleChangeOption = useCallback(
    (option: StoreOption | null, actionMeta: ActionMeta<StoreOption>) => {
      if (actionMeta.action === 'select-option') {
        dispatch({
          type: 'updateReceipt',
          personIndex,
          receiptIndex,
          receipt: { ...receipt, store: option?.data },
        });

        setStoreOptionValue(option);
      }
    },
    [dispatch, personIndex, receipt, receiptIndex, setStoreOptionValue],
  );

  const [dateInput, setDateInput] = useState<Date | null>(receipt.date || null);

  const handleChangeDate = useCallback(
    (date: Date) => {
      setDateInput(date);

      dispatch({
        type: 'updateReceipt',
        personIndex,
        receiptIndex,
        receipt: { ...receipt, date },
      });
    },
    [dispatch, personIndex, receipt, receiptIndex],
  );

  const removeReceipt = useCallback(() => {
    dispatch({ type: 'removeReceipt', personIndex, receiptIndex });
  }, [dispatch, personIndex, receiptIndex]);

  const { xOffset } = usePositionReceipt();

  return (
    <StyledReceipt xOffset={xOffset} width={theme.components.receipt.width}>
      <Container
        onMouseEnter={() => setShowRemoveButton(true)}
        onMouseLeave={() => setShowRemoveButton(false)}
      >
        <Table>
          <thead>
            <TableRow borderBottom>
              <TableCell colSpan={4} as="th" textAlign="center">
                <CreateableSelect
                  placeholder="Untitled"
                  options={storeOptions}
                  value={storeOptionValue}
                  onChangeOption={handleChangeOption}
                  onCreateOption={handleCreateOption}
                />
                <RemoveReceiptButton
                  isVisible={showRemoveButton}
                  onClick={removeReceipt}
                />
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
            <TableRow borderTop>
              <TableCell colSpan={2}>Date</TableCell>
              <TableCell colSpan={2} textAlign="right">
                <DatePicker value={dateInput} onChangeDate={handleChangeDate} />
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2} bold>
                Paid by
              </TableCell>
              <TableCell colSpan={2} bold textAlign="right">
                {people[personIndex].firstName}
              </TableCell>
            </TableRow>
            {receipt.items.map((item, index) => (
              <Item
                people={people}
                key={`${personIndex}-${receiptIndex}-${index}`}
                personIndex={personIndex}
                receiptIndex={receiptIndex}
                itemIndex={index}
                {...item}
              />
            ))}
            <TableRow borderBottom borderTop={receipt.items.length === 0}>
              <TableCell colSpan={4}>
                <Button ref={buttonRef} onClick={handleAddItem}>
                  +
                </Button>
              </TableCell>
            </TableRow>
            <TableRow borderTop>
              <TableCell colSpan={2}>Item count:</TableCell>
              <TableCell colSpan={2} textAlign="right">
                {receipt.items.length}
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2}>
                <b>Total:</b>
              </TableCell>
              <TableCell colSpan={2} textAlign="right">
                <b>${receipt.subtotal.toFixed(2)}</b>
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
