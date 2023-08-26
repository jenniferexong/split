import { useTheme } from 'styled-components';
import { InvoiceData } from '../../calculator';
import { Paper } from '../board';
import { Table, TableCell, TableRow } from '../table';
import { ReceiptContainer, ReceiptTitleRow } from '../receipt';

type InvoiceProps = InvoiceData;

export const Invoice = (props: InvoiceProps) => {
  const { totalSpendings, actualSpendings, owings } = props;

  const theme = useTheme();

  return (
    <Paper width={theme.components.invoice.width}>
      <ReceiptContainer>
        <Table>
          <ReceiptTitleRow>Invoice</ReceiptTitleRow>
          <tbody>
            <TableRow borderTop>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell colSpan={2} textAlign="right">
                ${totalSpendings.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell colSpan={2}>
                <h5>Actual</h5>
              </TableCell>
              <TableCell colSpan={2} textAlign="right">
                <h5>${actualSpendings.toFixed(2)}</h5>
              </TableCell>
            </TableRow>
            <TableRow borderTop>
              <TableCell colSpan={2}>owings</TableCell>
              <TableCell colSpan={2} textAlign="right">
                ${owings.toFixed(2)}
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </ReceiptContainer>
    </Paper>
  );
};
Invoice.displayName = 'EntryInvoice';
