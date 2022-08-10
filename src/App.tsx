import { calculateOwings, calculateSpendings } from 'calculator';
import { testData } from 'calculator/exampleData';
import { Board } from 'components/board/Board';
import { useReducer } from 'react';
import styled from 'styled-components';
import { reducer } from 'utils/reducer';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  // TODO
  padding: 40px;
  gap: 40px;
`;

export const App = () => {
  const [appState, dispatch] = useReducer(reducer, testData);

  const { ower, owee, amount } = calculateOwings(appState);

  const total = appState.people.reduce((acc, person) => {
    return (
      acc +
      person.receipts.reduce((acc, receipt) => {
        return acc + receipt.subtotal;
      }, 0)
    );
  }, 0);

  const spendings = calculateSpendings(appState);

  const conclusion = amount
    ? `${ower} owes ${owee} $${amount.toFixed(2)}`
    : 'No one owes anyone!';

  return (
    <>
      <Container>
        {appState.people.map((person, index) => (
          <Board
            key={index}
            person={person}
            personIndex={index}
            dispatch={dispatch}
          />
        ))}
      </Container>
      <p>Total: ${total.toFixed(2)}</p>
      {spendings.map(({ name, spendings }) => (
        <p key={name}>
          {name} spent ${spendings.toFixed(2)}
        </p>
      ))}
      <h4>{conclusion}</h4>
    </>
  );
};
App.displayName = 'App';
