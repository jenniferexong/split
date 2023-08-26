import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { ReceiptContainer, ReceiptTitleRow } from '../receipt';
import { getPersonTotalsForReceipts } from './utils';
import { ApiReceipt } from '../../api';
import { Paper } from '../board';
import { Table, TableCell, TableRow } from '../table';

interface InvoiceProps {
  receipts: ApiReceipt[];
}

export const Invoice = (props: InvoiceProps) => {
  const { receipts } = props;

  const theme = useTheme();
  const personTotals = useMemo(
    () => getPersonTotalsForReceipts(receipts),
    [receipts],
  );

  return (
    <Paper width={theme.components.invoice.width}>
      <ReceiptContainer>
        <Table>
          <ReceiptTitleRow>Invoice</ReceiptTitleRow>
          <tbody>
            {Object.values(personTotals).map((personTotal, index) => (
              <TableRow key={index} borderTop={index === 0}>
                <TableCell bold colSpan={2}>
                  {personTotal.name}
                </TableCell>
                <TableCell bold colSpan={2} textAlign="right">
                  ${personTotal.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </ReceiptContainer>
    </Paper>
  );
};
Invoice.displayName = 'Invoice';
