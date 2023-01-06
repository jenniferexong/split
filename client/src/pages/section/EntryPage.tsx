import { calculate } from 'calculator';
import { useMemo, useReducer } from 'react';
import { clearAction, reducer } from 'utils/reducer';
import { useLoaderData } from 'react-router-dom';
import nibbles from 'images/nibbles.jpg';
import pandy from 'images/pandy.jpg';
import { PersonBoard } from 'components/entry/PersonBoard';
import { useBottomTabBarMenu } from 'pages/contexts/LayoutContext';
import { ApiPerson } from 'api';
import { AppType } from 'calculator/types';

import 'react-toastify/dist/ReactToastify.css';
import { EntryPageData } from 'pages/types';
import { EntryPageContextProvider } from 'pages/contexts/EntryPageContext';

const getInitalState = (people: ApiPerson[]): AppType => ({
  people: [
    {
      person: people[0],
      image: nibbles,
      receipts: [],
    },
    {
      person: people[1],
      image: pandy,
      receipts: [],
    },
  ],
});

export const EntryPage = () => {
  const { stores, products, people } = useLoaderData() as EntryPageData;

  const [appState, dispatch] = useReducer(reducer, getInitalState(people));

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
      loadedPeople={people}
      loadedProducts={products}
      loadedStores={stores}
    >
      {appState.people.map((person, index) => (
        <PersonBoard
          key={index}
          person={person}
          personIndex={index}
          invoice={calculations.invoices[person.person.id]}
          dispatch={dispatch}
        />
      ))}
    </EntryPageContextProvider>
  );
};
EntryPage.displayName = 'EntryPage';
