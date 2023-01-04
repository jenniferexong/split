import { ApiProduct } from 'api';
import { gql, useQuery } from 'urql';
import { showError } from 'utils/showError';
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
  const [result] = useQuery<ProductsResult, {}>({ query });
  const { data, fetching, error } = result;

  if (fetching) return { fetching };
  if (error) showError('Could not get products', error);

  return { data: data?.products, fetching };
};
