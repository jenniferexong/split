import { ApiReceipt } from 'api';
import { gql, useClient } from 'urql';
import { QueryResult, ReceiptsResult } from './types';

// TODO
const query = gql`
  query {
    receipts {
      id
    }
  }
`;

export const useGetReceipts = (): QueryResult<ApiReceipt[]> => {
  const client = useClient();
  const loadData = client.query<ReceiptsResult>(query, {}).toPromise;

  return async () => {
    const result = await loadData();

    const { data, error } = result;

    if (error || !data) {
      throw new Error(JSON.stringify(error));
    }

    return data.receipts;
  };
};
