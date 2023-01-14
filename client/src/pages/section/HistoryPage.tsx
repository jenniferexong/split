import { Board } from 'components/board/Board';
import { Receipt } from 'components/history';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryPageData } from 'pages/types';
import { useLoaderData } from 'react-router';
import styled from 'styled-components';

const Container = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
`;

export const HistoryPage = () => {
  const { receipts } = useLoaderData() as HistoryPageData;

  console.log('data', receipts);
  return (
    <Board>
      <Container>
        <AnimatePresence>
          {receipts.map(receipt => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Receipt key={receipt.id} receipt={receipt} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Container>
    </Board>
  );
};
HistoryPage.displayName = 'HistoryPage';
