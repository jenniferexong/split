import { BoardLetters } from 'components/board';
import { Board } from 'components/board/Board';
import { Receipt } from 'components/history';
import { Invoice } from 'components/history/Invoice';
import { groupReceiptsByDate } from 'components/history/utils';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import { HistoryPageData } from 'pages/types';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router';
import styled from 'styled-components';

const Container = styled.div`
  & > :not(:last-child) {
    margin-bottom: 60px;
  }
`;

const ReceiptGroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
`;

const ReceiptsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 60px;
`;

export const HistoryPage = () => {
  const { receipts } = useLoaderData() as HistoryPageData;

  const groupedReceipts = useMemo(
    () => groupReceiptsByDate(receipts),
    [receipts],
  );

  return (
    <Board>
      <Container>
        <AnimatePresence>
          {groupedReceipts.map((receiptGroup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ReceiptGroupContainer>
                <BoardLetters>
                  {moment(receiptGroup[0].date).format('dddd Do MMMM YYYY')}
                </BoardLetters>
                <Invoice receipts={receiptGroup} />
                <ReceiptsContainer>
                  {receiptGroup.map(receipt => (
                    <Receipt key={receipt.id} receipt={receipt} />
                  ))}
                </ReceiptsContainer>
              </ReceiptGroupContainer>
            </motion.div>
          ))}
        </AnimatePresence>
      </Container>
    </Board>
  );
};
HistoryPage.displayName = 'HistoryPage';
