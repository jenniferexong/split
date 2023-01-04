import { gql, useMutation } from 'urql';
import { showError } from 'utils/showError';
import { toTitleCase } from 'utils/toTitleCase';
import { StoreResult } from './types';

interface CreateStoreVariables {
  name: string;
}

const query = gql<StoreResult, CreateStoreVariables>`
  mutation ($name: String!) {
    store(input: { name: $name }) {
      id
      name
    }
  }
`;

export const useCreateStore = () => {
  const [result, updateResult] = useMutation<StoreResult, CreateStoreVariables>(
    query,
  );

  const { fetching } = result;

  const createStore = (name: string) => {
    name = toTitleCase(name);

    updateResult({ name }).then(({ error }) => {
      if (error) {
        showError(`Could not create store: ${error.graphQLErrors}`);
      }
    });
  };

  return { createStore, fetching };
};
