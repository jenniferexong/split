import { ApiPerson } from 'api';
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
  people: (ApiPerson | undefined)[];
  personIndex: number;
  person: PersonType;
  invoice: InvoiceData;
}

export const PersonBoard = (props: PersonBoardProps) => {
  const {
    people,
    person: { person, image, receipts },
    personIndex,
    invoice: { totalSpendings, actualSpendings, oweings },
  } = props;

  const { dispatch } = useEntryPageContext();

  const hasSelectedPeople = hasSelectedAllPeople(people);

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
                people={people}
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
