import { ReceiptType } from 'calculator/types';
import { Button } from 'components/button';
import { Entry as Item } from 'components/item';
import React, { Dispatch, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { getLastAddedCell, TableCell } from 'components/table';
import { Action } from 'utils/reducer';
import { TableRow } from 'components/table/TableRow';
import { Barcode } from './Barcode';
import { Paper } from 'components/board';

const Container = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  // spacing
  padding: 20px 10px 10px;
  gap: 20px;
`;

interface ReceiptProps {
  personIndex: number;
  receiptIndex: number;
  receipt: ReceiptType;
  dispatch: Dispatch<Action>;
}

const Table = styled.table`
  border-collapse: collapse;
  text-transform: uppercase;
  width: 100%;
`;

export const Receipt = (props: ReceiptProps) => {
  const {
    personIndex,
    receiptIndex,
    dispatch,
    receipt: { items, subtotal, title },
  } = props;

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
    <Paper width={theme.components.receipt.width}>
      <Container>
        <Table>
          <thead>
            <TableRow borderBottom>
              <TableCell
                contentEditable
                onBlur={updateTitle}
                colSpan={3}
                as="th"
              >
                <h3>{title}</h3>
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
              <TableCell dir="rtl">{items.length}</TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2}>
                <b>Total:</b>
              </TableCell>
              <TableCell dir="rtl">
                <b>${subtotal.toFixed(2)}</b>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
        <Barcode />
      </Container>
    </Paper>
  );
};
Receipt.displayText = 'Receipt';
