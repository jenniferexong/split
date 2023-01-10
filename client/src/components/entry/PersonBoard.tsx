import { InvoiceData, PersonType } from 'calculator/types';
import { Board, BoardLetters } from 'components/board';
import { Person } from 'components/board/Person';
import { Invoice, Receipt } from 'components/receipt';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import styled from 'styled-components';
import { hasSelectedAllPeople } from 'utils/hasSelectedAllPeople';
import { showError } from 'utils/showToast';

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
    invoice: { totalSpendings, actualSpendings, oweings },
  } = props;

  const { selectedPeople, dispatch } = useEntryPageContext();

  const hasSelectedPeople = hasSelectedAllPeople(selectedPeople);

  const handleAddReceipt = () => {
    if (!hasSelectedPeople) {
      showError('Must select both people');
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
          oweings={oweings}
        />
        {receipts.map(
          (receipt, index) =>
            hasSelectedPeople && (
              <Receipt
                people={selectedPeople}
                key={`${personIndex}-${index}`}
                personIndex={personIndex}
                receiptIndex={index}
                receipt={receipt}
              />
            ),
        )}
        <BoardLetters onClick={handleAddReceipt}>+</BoardLetters>
      </Container>
    </Board>
  );
};
