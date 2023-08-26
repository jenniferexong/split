import { gql, useMutation } from 'urql';
import { StoreResult } from './types';
import { ApiStore } from '../types';
import { toTitleCase } from '../../utils/toTitleCase';

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

  const createStore = async (name: string): Promise<ApiStore> => {
    name = toTitleCase(name);

    const { data, error } = await updateResult({ name });

    if (error || !data) {
      // TODO
      throw new Error(JSON.stringify(error));
    }

    return data.store;
  };

  return { createStore, fetching };
};
