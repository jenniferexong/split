import { PropsWithChildren } from 'react';
import { TableCell, TableRow } from '../table';

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
