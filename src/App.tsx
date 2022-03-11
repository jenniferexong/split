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

  return (
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
  );
};
