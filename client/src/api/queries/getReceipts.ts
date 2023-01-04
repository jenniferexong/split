import { ApiReceipt } from 'api';
import { gql, useQuery } from 'urql';
import { showError } from 'utils/showError';
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
  const [result] = useQuery<ReceiptsResult, {}>({ query });
  const { data, fetching, error } = result;

  if (fetching) return { fetching };
  if (error) showError('Could not get receipts', error);

  return { data: data?.receipts, fetching };
};
