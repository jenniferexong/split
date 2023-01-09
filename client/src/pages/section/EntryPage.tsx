import { calculate } from 'calculator';
import { useMemo, useReducer } from 'react';
import { clearAction, initialState, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { ApiPerson } from 'api';

import 'react-toastify/dist/ReactToastify.css';
import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';

export const EntryPage = () => {
  const {
    stores: loadedStores,
    products: loadedProducts,
    people: loadedPeople,
  } = useLoaderData() as EntryPageData;

  const [appState, dispatch] = useReducer(reducer, initialState);

  console.log('app state', appState);

  const people: (ApiPerson | undefined)[] = useMemo(
    () => appState.people.map(person => person.person),
    [appState.people],
  );

  useBottomTabBarMenu([
    {
      label: 'Clear',
      onClick: () => dispatch(clearAction),
    },
    {
      label: 'Save',
    },
  ]);

  const calculations = useMemo(() => calculate(appState), [appState]);

  return (
    <EntryPageContextProvider
      appState={appState}
      loadedPeople={loadedPeople}
      loadedProducts={loadedProducts}
      loadedStores={loadedStores}
      dispatch={dispatch}
    >
      {appState.people.map((person, index) => (
        <PersonBoard
          people={people}
          key={index}
          person={person}
          personIndex={index}
          invoice={calculations.invoices[index]}
        />
      ))}
    </EntryPageContextProvider>
  );
};
EntryPage.displayName = 'EntryPage';
