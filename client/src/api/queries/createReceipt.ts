import { gql, useMutation } from 'urql';
import { showError } from 'utils/showError';
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

  const createReceipt = (input: CreateReceiptInput) => {
    const variables = mapReceiptInputToReceiptVariables(input);

    updateResult(variables).then(({ error }) => {
      if (error) {
        showError('Could not create receipt', error);
      }
    });
  };

  return { createReceipt, fetching };
};
