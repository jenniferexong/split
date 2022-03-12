import { calculateOwings, calculateSpendings } from "calculator";
import { testData } from "calculator/exampleData";
import { Person } from "components/person";
import { useReducer } from "react";
import styled from "styled-components";
import { initialState, reducer } from "utils/reducer";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

export const App: React.FC = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);

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
    : "No one owes anyone!";

  console.log(appState);

  return (
    <>
      <Container>
        {appState.people.map((person, index) => (
          <Person
            key={person.name}
            {...person}
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
