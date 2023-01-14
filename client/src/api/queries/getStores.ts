import { ApiStore } from 'api';
import { gql, useClient } from 'urql';
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
  const client = useClient();
  const loadData = client.query<StoresResult>(query, {}).toPromise;

  return async () => {
    const result = await loadData();

    const { data, error } = result;

    if (error || !data) {
      throw new Error(JSON.stringify(error));
    }

    return data.stores;
  };
};
