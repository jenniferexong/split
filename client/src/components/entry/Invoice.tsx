import { InvoiceData } from 'calculator/types';
import { Paper } from 'components/board';
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
          <thead>
            <TableRow borderBottom>
              <TableCell as="th" textAlign="center" colSpan={2}>
                Invoice
              </TableCell>
            </TableRow>
          </thead>
          <tbody>
            <TableRow borderTop>
              <TableCell>Total</TableCell>
              <TableCell textAlign="right">
                ${totalSpendings.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow borderBottom>
              <TableCell>
                <h5>Actual</h5>
              </TableCell>
              <TableCell textAlign="right">
                <h5>${actualSpendings.toFixed(2)}</h5>
              </TableCell>
            </TableRow>
            <TableRow borderTop>
              <TableCell>Oweings</TableCell>
              <TableCell textAlign="right">${oweings.toFixed(2)}</TableCell>
            </TableRow>
          </tbody>
        </Table>
      </ReceiptContainer>
    </Paper>
  );
};
