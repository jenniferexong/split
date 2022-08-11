import { PersonType } from 'calculator/types';
import { Invoice, Receipt } from 'components/receipt';
import { Dispatch } from 'react';
import styled from 'styled-components';
import { Action } from 'utils/reducer';
import { BoardLetters } from './BoardLetters';

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
  dispatch: Dispatch<Action>;
}

export const Board = (props: BoardProps) => {
  const {
    person: { name, receipts },
    personIndex,
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
      <h1>{name}</h1>
      {/* TODO */}
      <Invoice totalSpendings={0} actualSpendings={0} oweings={0} />
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
