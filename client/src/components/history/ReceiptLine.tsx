import { ApiReceiptLine } from 'api';
import { TableCell } from 'components/table';
import { TableRow } from 'components/table/TableRow';

export interface ReceiptLineProps {
  receiptLine: ApiReceiptLine;
  isFirstItem: boolean;
  isLastItem: boolean;
}

export const ReceiptLine = (props: ReceiptLineProps) => {
  const {
    receiptLine: { price, product, splits },
    isFirstItem,
    isLastItem,
  } = props;

  return (
    <>
      <TableRow borderTop={isFirstItem}>
        <TableCell colSpan={3}>{product.name}</TableCell>

        <TableCell colSpan={1} textAlign="right">
          {price.toFixed(2)}
        </TableCell>
      </TableRow>
      {splits.map((split, index) => (
        <TableRow
          key={split.person.email}
          borderBottom={isLastItem && index === splits.length - 1}
        >
          <TableCell colSpan={3} textSize="small">
            &emsp;&emsp;&emsp;{split.person.firstName}
          </TableCell>
          <TableCell colSpan={1} textSize="small" textAlign="right">
            {split.amount.toFixed(2)}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
ReceiptLine.displayName = 'ReceiptLine';
