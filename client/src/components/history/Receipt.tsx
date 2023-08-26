import styled, { useTheme } from 'styled-components';
import { useMemo } from 'react';
import moment from 'moment';
import { ReceiptLine } from './ReceiptLine';
import { getPersonTotalsForReceipt } from './utils';
import { Paper } from '../board';
import { ApiReceipt } from '../../api';
import {
  Barcode,
  ReceiptContainer,
  ReceiptSubheaderSection,
  ReceiptSubtotalSection,
  ReceiptTitleRow,
} from '../receipt';
import { Table, TableCell, TableRow } from '../table';

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

  const personTotals = useMemo(
    () => Object.values(getPersonTotalsForReceipt(props.receipt)),
    [props.receipt],
  );

  const theme = useTheme();

  return (
    <StyledReceipt width={theme.components.receipt.width}>
      <ReceiptContainer>
        <Table>
          <ReceiptTitleRow>{store.name}</ReceiptTitleRow>
          <tbody>
            <ReceiptSubheaderSection
              date={moment(date).format('DD/MM/YYYY')}
              paidBy={paidBy.firstName}
            />
            {receiptLines.map((receiptLine, index) => (
              <ReceiptLine
                key={receiptLine.id}
                receiptLine={receiptLine}
                isFirstItem={index === 0}
                isLastItem={index === receiptLines.length - 1}
              />
            ))}
            <ReceiptSubtotalSection
              itemCount={receiptLines.length}
              total={total}
            />
            {personTotals.map((personTotal, index) => (
              <TableRow
                key={index}
                borderTop={index === 0}
                borderBottom={index === personTotals.length - 1}
              >
                <TableCell colSpan={2}>
                  <h5>{personTotal.name}</h5>
                </TableCell>
                <TableCell colSpan={2} textAlign="right">
                  <h5>${personTotal.total.toFixed(2)}</h5>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <Barcode />
      </ReceiptContainer>
    </StyledReceipt>
  );
};
Receipt.displayText = 'HistoryReceipt';
