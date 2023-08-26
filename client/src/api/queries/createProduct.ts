import { gql, useMutation } from 'urql';
import { ProductResult } from './types';
import { toTitleCase } from '../../utils/toTitleCase';

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

  const createProduct = async (name: string) => {
    name = toTitleCase(name);

    const { data, error } = await updateResult({ name });

    if (error || !data) {
      // TODO
      throw new Error(JSON.stringify(error));
    }

    return data.product;
  };

  return { createProduct, fetching };
};
