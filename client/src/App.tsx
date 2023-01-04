import { calculate } from 'calculator';
import { Board } from 'components/board/Board';
import { useMemo, useReducer } from 'react';
import styled from 'styled-components';
import { initialState, reducer } from 'utils/reducer';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  // TODO
  padding: 40px;
  gap: 40px;
`;

export const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);

  const calculations = useMemo(() => calculate(appState), [appState]);

  return (
    <>
      <ToastContainer
        autoClose={6000}
        position="top-center"
        hideProgressBar
        theme="dark"
        limit={1}
      />
      <Container>
        {appState.people.map((person, index) => (
          <Board
            key={index}
            person={person}
            personIndex={index}
            invoice={calculations.invoices[index]}
            dispatch={dispatch}
          />
        ))}
      </Container>
    </>
  );
};
App.displayName = 'App';
