import { ReceiptType } from 'calculator/types';
import { Button } from 'components/button';
import { Entry as Item } from 'components/item';
import React, { Dispatch, useRef } from 'react';
import styled from 'styled-components';
import { getLastAddedCell, TableCell } from 'components/table';
import { Action } from 'utils/reducer';

const Container = styled.section`
  width: 100%;
  border: solid gray 1px;
  padding: 1em;
  display: flex;
  flex-direction: column;
`;

const SubTotal = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

interface ReceiptProps extends ReceiptType {
  personIndex: number;
  receiptIndex: number;
  dispatch: Dispatch<Action>;
}

export const Receipt = (props: ReceiptProps) => {
  const { personIndex, receiptIndex, dispatch, items, subtotal, title } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const updateTitle = (e: React.FocusEvent<HTMLTableCellElement>) => {
    const text = e.target.innerText;

    dispatch({
      type: 'updateReceipt',
      personIndex,
      receiptIndex,
      receipt: { title: text, items, subtotal },
    });
  };

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <TableCell contentEditable onBlur={updateTitle} colSpan={3} as="th">
              {title}
            </TableCell>
          </tr>
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
          <tr>
            <td colSpan={3}>
              <Button ref={buttonRef} onClick={handleAddItem}>
                Add item
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <SubTotal>
        <strong>Subtotal</strong>
        <strong>${subtotal.toFixed(2)}</strong>
      </SubTotal>
    </Container>
  );
};
Receipt.displayText = 'Receipt';
