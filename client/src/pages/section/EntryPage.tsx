import { calculate } from 'calculator';
import { useMemo, useReducer } from 'react';
import { initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { PersonBoard } from 'components/entry/PersonBoard';

export const EntryPage = () => {
  const data = useLoaderData();
  console.log('upload data', JSON.stringify(data));

  const [appState, dispatch] = useReducer(reducer, initialState);

  const calculations = useMemo(() => calculate(appState), [appState]);

  return (
    <>
      {appState.people.map((person, index) => (
        <PersonBoard
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
EntryPage.displayName = 'EntryPage';
