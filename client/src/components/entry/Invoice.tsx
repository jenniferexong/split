import { InvoiceData } from 'calculator/types';
import { Paper } from 'components/board';
import { ReceiptTitleRow } from 'components/receipt';
import { Table, TableCell, TableRow } from 'components/table';
import { useTheme } from 'styled-components';
import { ReceiptContainer } from '../receipt/ReceiptContainer';

type InvoiceProps = InvoiceData;

export const Invoice = (props: InvoiceProps) => {
  const { totalSpendings, actualSpendings, oweings } = props;

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
              <TableCell colSpan={2}>Oweings</TableCell>
              <TableCell colSpan={2} textAlign="right">
                ${oweings.toFixed(2)}
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </ReceiptContainer>
    </Paper>
  );
};
