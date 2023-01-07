import { ApiPerson } from 'api';
import { InvoiceData, PersonType } from 'calculator/types';
import { Board, BoardLetters } from 'components/board';
import { Person } from 'components/board/Person';
import { Invoice, Receipt } from 'components/receipt';
import { Dispatch } from 'react';
import styled from 'styled-components';
import { Action } from 'utils/reducer';

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
  people: ApiPerson[];
  personIndex: number;
  person: PersonType;
  invoice: InvoiceData;
  dispatch: Dispatch<Action>;
}

export const PersonBoard = (props: PersonBoardProps) => {
  const {
    people,
    person: { person, image, receipts },
    personIndex,
    invoice: { totalSpendings, actualSpendings, oweings },
    dispatch,
  } = props;

  const handleAddReceipt = () => {
    dispatch({
      type: 'addReceipt',
      personIndex,
    });
  };

  return (
    <Board>
      <Container>
        <Person name={person.firstName} image={image} />
        <Invoice
          totalSpendings={totalSpendings}
          actualSpendings={actualSpendings}
          oweings={oweings}
        />
        {receipts.map((receipt, index) => (
          <Receipt
            people={people}
            key={`${personIndex}-${index}`}
            personIndex={personIndex}
            receiptIndex={index}
            receipt={receipt}
            dispatch={dispatch}
          />
        ))}
        <BoardLetters onClick={handleAddReceipt}>+</BoardLetters>
      </Container>
    </Board>
  );
};
PersonBoard.displayName = 'PersonBoard';
