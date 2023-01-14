import styled, { useTheme } from 'styled-components';
import { Table, TableCell, TableRow } from 'components/table';
import { Paper } from 'components/board';
import { Barcode } from 'components/entry/receipt/Barcode';
import { ApiReceipt } from 'api';
import { useMemo } from 'react';
import { ReceiptInnerContainer } from 'components/entry/receipt/Container';
import moment from 'moment';
import { ReceiptLine } from './ReceiptLine';

const StyledReceipt = styled(Paper)`
  position: relative;
  grid-column: span 2;
`;

interface ReceiptProps {
  receipt: ApiReceipt;
}

export const Receipt = (props: ReceiptProps) => {
  const {
    receipt: { store, date, paidBy, receiptLines },
  } = props;

  const total = useMemo(
    () =>
      receiptLines.reduce((total, receiptLine) => total + receiptLine.price, 0),
    [receiptLines],
  );

  const theme = useTheme();

  return (
    <StyledReceipt width={theme.components.receipt.width}>
      <ReceiptInnerContainer>
        <Table>
          <thead>
            <TableRow borderBottom>
              <TableCell colSpan={4} as="th" textAlign="center">
                {store.name}
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
            <TableRow borderTop>
              <TableCell colSpan={2}>Date</TableCell>
              <TableCell colSpan={2} textAlign="right">
                {moment(date).format('DD/MM/YYYY')}
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2} bold>
                Paid by
              </TableCell>
              <TableCell colSpan={2} bold textAlign="right">
                {paidBy.firstName}
              </TableCell>
            </TableRow>
            {receiptLines.map((receiptLine, index) => (
              <ReceiptLine
                key={receiptLine.id}
                receiptLine={receiptLine}
                isFirstItem={index === 0}
                isLastItem={index === receiptLines.length - 1}
              />
            ))}
            <TableRow borderTop>
              <TableCell colSpan={2}>Item count:</TableCell>
              <TableCell colSpan={2} textAlign="right">
                {receiptLines.length}
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2}>
                <b>Total:</b>
              </TableCell>
              <TableCell colSpan={2} textAlign="right">
                <b>{total.toFixed(2)}</b>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
        <Barcode />
      </ReceiptInnerContainer>
    </StyledReceipt>
  );
};
Receipt.displayText = 'Receipt';
