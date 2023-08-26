import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Invoice } from './Invoice';
import { Receipt } from './Receipt';
import { InvoiceData, PersonType } from '../../calculator';
import { useEntryPageContext } from '../../pages/contexts';
import { Person } from './Person';
import { Board, BoardLetters } from '../board';
import { hasSelectedAllPeople } from '../../utils/hasSelectedAllPeople';
import { showError } from '../../utils/notification';

const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
  justify-items: center;
  align-items: center;
  grid-gap: 50px;

  & > *:last-child {
    margin-bottom: 0;
  }
`;

interface PersonBoardProps {
  personIndex: number;
  person: PersonType;
  invoice: InvoiceData;
}

export const PersonBoard = (props: PersonBoardProps) => {
  const {
    person: { person, image, receipts },
    personIndex,
    invoice: { totalSpendings, actualSpendings, owings },
  } = props;

  const { selectedPeople, dispatch } = useEntryPageContext();

  const hasSelectedPeople = hasSelectedAllPeople(selectedPeople);

  const handleAddReceipt = () => {
    if (!hasSelectedPeople) {
      showError('Must select both people', 'error-must-select-all-people');
      return;
    }

    dispatch({
      type: 'addReceipt',
      personIndex,
    });
  };

  return (
    <Board>
      <Container>
        <Person personIndex={personIndex} person={person} image={image} />
        <Invoice
          person={person}
          totalSpendings={totalSpendings}
          actualSpendings={actualSpendings}
          owings={owings}
        />
        <AnimatePresence>
          {receipts.map(
            (receipt, index) =>
              hasSelectedPeople && (
                <motion.div
                  style={{ gridColumn: 'span 2' }}
                  key={receipt.sequence}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Receipt
                    key={receipt.sequence}
                    people={selectedPeople}
                    personIndex={personIndex}
                    receiptIndex={index}
                    receipt={receipt}
                  />
                </motion.div>
              ),
          )}
        </AnimatePresence>
        <BoardLetters onClick={handleAddReceipt}>+</BoardLetters>
      </Container>
    </Board>
  );
};
