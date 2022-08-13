import { InvoiceData, PersonType } from 'calculator/types';
import { Invoice, Receipt } from 'components/receipt';
import { Dispatch } from 'react';
import styled from 'styled-components';
import { Action } from 'utils/reducer';
import { BoardLetters } from './BoardLetters';
import { Person } from './Person';

const Container = styled.div`
  width: 100%;

  // todo
  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${props => props.theme.colors.caramel};
  gap: 50px;
  padding: 20px;

  & > *:last-child {
    margin-bottom: 0;
  }
`;

interface BoardProps {
  personIndex: number;
  person: PersonType;
  invoice: InvoiceData;
  dispatch: Dispatch<Action>;
}

export const Board = (props: BoardProps) => {
  const {
    person: { name, receipts },
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
    <Container>
      <Person name={name} />
      <Invoice
        totalSpendings={totalSpendings}
        actualSpendings={actualSpendings}
        oweings={oweings}
      />
      {receipts.map((receipt, index) => (
        <Receipt
          key={`${personIndex}-${index}`}
          personIndex={personIndex}
          receiptIndex={index}
          receipt={receipt}
          dispatch={dispatch}
        />
      ))}
      <BoardLetters onClick={handleAddReceipt}>Add receipt</BoardLetters>
    </Container>
  );
};
Board.displayName = 'Person';
