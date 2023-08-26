import { TableCell, TableRow } from '../table';

interface ReceiptSubtotalSectionProps {
  itemCount: number;
  total: number;
}

export const ReceiptSubtotalSection = (props: ReceiptSubtotalSectionProps) => {
  const { itemCount, total } = props;

  return (
    <>
      <TableRow borderTop>
        <TableCell colSpan={2}>Item count:</TableCell>
        <TableCell colSpan={2} textAlign="right">
          {itemCount}
        </TableCell>
      </TableRow>
      <TableRow borderBottom>
        <TableCell colSpan={2}>
          <b>Total:</b>
        </TableCell>
        <TableCell colSpan={2} textAlign="right">
          <b>${total.toFixed(2)}</b>
        </TableCell>
      </TableRow>
    </>
  );
};
ReceiptSubtotalSection.displayName = 'ReceiptSubtotalSection';
