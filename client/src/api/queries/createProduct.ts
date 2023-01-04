import { gql, useMutation } from 'urql';
import { showError } from 'utils/showError';
import { toTitleCase } from 'utils/toTitleCase';
import { ProductResult } from './types';

interface CreateProductVariables {
  name: string;
}

const query = gql<ProductResult, CreateProductVariables>`
  mutation ($name: String!) {
    product(input: { name: $name }) {
      id
      name
    }
  }
`;

export const useCreateProduct = () => {
  const [result, updateResult] = useMutation<
    ProductResult,
    CreateProductVariables
  >(query);

  const { fetching } = result;

  const createProduct = (name: string) => {
    name = toTitleCase(name);

    updateResult({ name }).then(({ error }) => {
      if (error) {
        showError(`Could not create product: ${error.graphQLErrors}`);
      }
    });
  };

  return { createProduct, fetching };
};
