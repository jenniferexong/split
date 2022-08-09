import { PersonType } from 'calculator/types';
import { Button } from 'components/button';
import { Receipt } from 'components/receipt';
import { Dispatch } from 'react';
import styled from 'styled-components';
import { Action } from 'utils/reducer';

const Container = styled.div`
  width: 100%;
  height: 100%;

  // todo
  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${props => props.theme.colors.caramel};
  gap: 1em;
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
      {receipts.map((receipt, index) => (
        <Receipt
          key={`${personIndex}-${index}`}
          personIndex={personIndex}
          receiptIndex={index}
          receipt={receipt}
          dispatch={dispatch}
        />
      ))}
      <Button onClick={handleAddReceipt}>Add receipt</Button>
    </Container>
  );
};
Board.displayName = 'Person';
