import { gql, useMutation } from 'urql';
import { DeleteReceiptResult } from './types';
import { ApiReceipt } from '../types';

interface DeleteReceiptVariables {
  id: number;
}

const query = gql<DeleteReceiptResult, DeleteReceiptVariables>`
  mutation ($id: Int!) {
    deleteReceipt(id: $id) {
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

export const useDeleteReceipt = () => {
  const [result, updateResult] = useMutation<
    DeleteReceiptResult,
    DeleteReceiptVariables
  >(query);

  const { fetching } = result;

  const deleteReceipt = async (id: number): Promise<ApiReceipt> => {
    const { data, error } = await updateResult({ id });

    if (error || !data) {
      throw error;
    }

    return data.deletedReceipt;
  };

  return { deleteReceipt, fetching };
};
