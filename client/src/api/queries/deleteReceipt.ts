import { ApiReceipt } from 'api/types';
import { gql, useMutation } from 'urql';
import { DeleteReceiptResult } from './types';

interface DeleteReceiptVariables {
  id: number;
}

const query = gql<DeleteReceiptResult, DeleteReceiptVariables>`
  mutation ($id: Int!) {
    deleteReceipt(id: $id) {
      id
      date
      personId
      storeId
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

    return data.deleteReceipt;
  };

  return { deleteReceipt, fetching };
};
