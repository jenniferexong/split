import { gql, useMutation } from 'urql';
import { showApiError } from 'utils/showError';
import { ReceiptResult } from './types';

interface ReceiptLineSplitInput {
  personId: number;
  antecedent: number;
}

interface ReceiptLineInput {
  productId: number;
  price: number;
  receiptLineSplits: ReceiptLineSplitInput[];
}

export interface CreateReceiptInput {
  storeId: number;
  personId: number;
  date: Date;
  receiptLines: ReceiptLineInput[];
}

interface CreateReceiptVariables {
  input: {
    storeId: number;
    personId: number;
    date: string;
    receiptLines: ReceiptLineInput[];
  };
}

// TODO
const query = gql<ReceiptResult, CreateReceiptVariables>`
  mutation ($input: CreateReceiptInput!) {
    receipt(input: $input) {
      id
    }
  }
`;

const mapReceiptInputToReceiptVariables = (
  input: CreateReceiptInput,
): CreateReceiptVariables => {
  return {
    input: {
      ...input,
      date: input.date.toISOString(),
    },
  };
};

export const useCreateReceipt = () => {
  const [result, updateResult] = useMutation<
    ReceiptResult,
    CreateReceiptVariables
  >(query);

  const { fetching } = result;

  const createReceipt = async (input: CreateReceiptInput) => {
    const variables = mapReceiptInputToReceiptVariables(input);

    const { error } = await updateResult(variables);

    if (error) {
      showApiError('Could not create receipt', error);
    }
  };

  return { createReceipt, fetching };
};
