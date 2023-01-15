import { ApiReceipt } from 'api';
import { Paper } from 'components/board';
import { ReceiptTitleRow } from 'components/receipt';
import { Table, TableCell, TableRow } from 'components/table';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { ReceiptContainer } from '../receipt/ReceiptContainer';
import { getPersonTotalsForReceipts } from './utils';

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
