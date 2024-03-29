import { useCallback, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ActionMeta } from 'react-select';
import { Paper } from '../board';
import { ApiPerson, useCreateStore } from '../../api';
import { ReceiptType } from '../../calculator';
import { DeleteButton, ReceiptButton } from '../button';
import { useEntryPageContext } from '../../pages/contexts';
import {
  CreateableSelect,
  DatePicker,
  StoreOption,
  mapStoreToOption,
  useOptionValue,
} from '../input';
import {
  Table,
  TableCell,
  TableRow,
  focusTableCell,
  getLastAddedCell,
} from '../table';
import { usePositionReceipt } from '../receipt/utils';
import {
  Barcode,
  ReceiptContainer,
  ReceiptSubheaderSection,
  ReceiptSubtotalSection,
  ReceiptTitleRow,
} from '../receipt';
import { Item } from './Item';
import { getReceiptSubtotal } from '../../utils/getReceiptSubtotal';

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

  const [showRemoveButton, setShowRemoveButton] = useState<boolean>(false);

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
    dispatch({ type: 'removeReceipt', sequence: receipt.sequence });
  }, [dispatch, receipt.sequence]);

  const { xOffset } = usePositionReceipt();

  return (
    <StyledReceipt xOffset={xOffset} width={theme.components.receipt.width}>
      <ReceiptContainer
        onMouseEnter={() => setShowRemoveButton(true)}
        onMouseLeave={() => setShowRemoveButton(false)}
      >
        <Table>
          <ReceiptTitleRow>
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
          </ReceiptTitleRow>
          <tbody>
            <ReceiptSubheaderSection
              date={
                <DatePicker value={dateInput} onChangeDate={handleChangeDate} />
              }
              paidBy={people[personIndex].firstName}
            />
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
                <ReceiptButton ref={buttonRef} onClick={handleAddItem}>
                  +
                </ReceiptButton>
              </TableCell>
            </TableRow>
            <ReceiptSubtotalSection
              itemCount={receipt.items.length}
              total={getReceiptSubtotal(receipt)}
            />
          </tbody>
        </Table>
        <Barcode />
      </ReceiptContainer>
    </StyledReceipt>
  );
};
Receipt.displayText = 'EntryReceipt';
