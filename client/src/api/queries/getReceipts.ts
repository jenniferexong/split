import { ApiReceipt } from 'api';
import { gql, useClient } from 'urql';
import { QueryResult, ReceiptsResult } from './types';

const query = gql`
  query {
    receipts {
      id
      date
      store {
        id
        name
      }
      paidBy {
        id
        firstName
        lastName
        email
      }
      receiptLines {
        id
        product {
          id
          name
        }
        price
        splits {
          id
          person {
            id
            firstName
            lastName
            email
          }
          amount
        }
      }
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

    // convert date strings to Date
    data.receipts.forEach(receipt => {
      receipt.date = new Date(receipt.date);
    });

    return data.receipts;
  };
};
