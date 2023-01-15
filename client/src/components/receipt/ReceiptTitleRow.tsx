import { TableCell, TableRow } from 'components/table';
import { PropsWithChildren } from 'react';

type ReceiptTitleRowProps = PropsWithChildren<{}>;

export const ReceiptTitleRow = (props: ReceiptTitleRowProps) => {
  const { children } = props;

  return (
    <thead>
      <TableRow borderBottom>
        <TableCell colSpan={4} as="th" textAlign="center">
          {children}
        </TableCell>
      </TableRow>
    </thead>
  );
};
ReceiptTitleRow.displayName = 'ReceiptTitleRow';
