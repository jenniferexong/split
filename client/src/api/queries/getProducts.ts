import { ApiProduct } from 'api/types';
import { gql, useClient } from 'urql';
import { ProductsResult, QueryResult } from './types';

const query = gql`
  query {
    products {
      id
      name
    }
  }
`;

export const useGetProducts = (): QueryResult<ApiProduct[]> => {
  const client = useClient();
  const loadData = client.query<ProductsResult>(query, {}).toPromise;

  return async () => {
    const result = await loadData();

    const { data, error } = result;

    if (error || !data) {
      throw new Error(JSON.stringify(error));
    }

    return data.products;
  };
};
