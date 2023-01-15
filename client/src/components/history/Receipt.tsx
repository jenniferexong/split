import styled, { useTheme } from 'styled-components';
import { Paper } from 'components/board';
import { Barcode } from 'components/receipt/Barcode';
import { ApiReceipt } from 'api';
import { useMemo } from 'react';
import moment from 'moment';
import { ReceiptLine } from './ReceiptLine';
import {
  ReceiptContainer,
  ReceiptSubheaderSection,
  ReceiptSubtotalSection,
  ReceiptTitleRow,
} from 'components/receipt';
import { Table } from 'components/table';

const StyledReceipt = styled(Paper)`
  position: relative;
  grid-column: span 2;
`;

interface ReceiptProps {
  receipt: ApiReceipt;
}

export const Receipt = (props: ReceiptProps) => {
  const {
    receipt: { store, date, paidBy, receiptLines },
  } = props;

  const total = useMemo(
    () =>
      receiptLines.reduce((total, receiptLine) => total + receiptLine.price, 0),
    [receiptLines],
  );

  const theme = useTheme();

  return (
    <StyledReceipt width={theme.components.receipt.width}>
      <ReceiptContainer>
        <Table>
          <ReceiptTitleRow>{store.name}</ReceiptTitleRow>
          <tbody>
            <ReceiptSubheaderSection
              date={moment(date).format('DD/MM/YYYY')}
              paidBy={paidBy.firstName}
            />
            {receiptLines.map((receiptLine, index) => (
              <ReceiptLine
                key={receiptLine.id}
                receiptLine={receiptLine}
                isFirstItem={index === 0}
                isLastItem={index === receiptLines.length - 1}
              />
            ))}
            <ReceiptSubtotalSection
              itemCount={receiptLines.length}
              total={total}
            />
          </tbody>
        </Table>
        <Barcode />
      </ReceiptContainer>
    </StyledReceipt>
  );
};
Receipt.displayText = 'Receipt';
