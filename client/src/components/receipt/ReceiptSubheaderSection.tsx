import { TableCell, TableRow } from 'components/table';
import { ReactNode } from 'react';

interface ReceiptSubheaderSectionProps {
  date: ReactNode;
  paidBy: string;
}

export const ReceiptSubheaderSection = (
  props: ReceiptSubheaderSectionProps,
) => {
  const { date, paidBy } = props;

  return (
    <>
      <TableRow borderTop>
        <TableCell colSpan={2}>Date</TableCell>
        <TableCell colSpan={2} textAlign="right">
          {date}
        </TableCell>
      </TableRow>
      <TableRow borderBottom>
        <TableCell colSpan={2} bold>
          Paid by
        </TableCell>
        <TableCell colSpan={2} bold textAlign="right">
          {paidBy}
        </TableCell>
      </TableRow>
    </>
  );
};
ReceiptSubheaderSection.displayName = 'ReceiptSubheaderSection';
