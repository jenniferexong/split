import { calculate } from 'calculator';
import { Board } from 'components/board/Board';
import { useMemo, useReducer } from 'react';
import { initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

export const UploadPage = () => {
  const data = useLoaderData();
  console.log('upload data', JSON.stringify(data));

  const [appState, dispatch] = useReducer(reducer, initialState);

  const calculations = useMemo(() => calculate(appState), [appState]);

  return (
    <>
      {appState.people.map((person, index) => (
        <Board
          key={index}
          person={person}
          personIndex={index}
          invoice={calculations.invoices[index]}
          dispatch={dispatch}
        />
      ))}
    </>
  );
};
UploadPage.displayName = 'UploadPage';
