import { ApiStore } from 'api';
import { gql, useQuery } from 'urql';
import { showError } from 'utils/showError';
import { QueryResult, StoresResult } from './types';

const query = gql`
  query {
    stores {
      id
      name
    }
  }
`;

export const useGetStores = (): QueryResult<ApiStore[]> => {
  const [result] = useQuery<StoresResult, {}>({ query });
  const { data, fetching, error } = result;

  if (fetching) return { fetching };
  if (error) showError('Could not get stores', error);

  return { data: data?.stores, fetching };
};
