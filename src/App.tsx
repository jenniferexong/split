import { calculate } from "calculator/calculate";
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

  const { ower, owee, amount } = calculate(appState);
  const conclusion = `${ower} owes ${owee} $${amount.toFixed(2)}`;

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
      <p>{conclusion}</p>
    </>
  );
};
