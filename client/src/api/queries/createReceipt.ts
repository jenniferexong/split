import { ApiReceipt } from 'api/types';
import { gql, useMutation } from 'urql';
import { ReceiptResult } from './types';

export interface ReceiptLineSplitInput {
  personId: number;
  antecedent: number;
}

export interface ReceiptLineInput {
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

  const createReceipt = async (
    input: CreateReceiptInput,
  ): Promise<ApiReceipt> => {
    const variables = mapReceiptInputToReceiptVariables(input);

    const { data, error } = await updateResult(variables);

    if (error || !data) {
      throw new Error(JSON.stringify(error));
    }

    return data.receipt;
  };

  return { createReceipt, fetching };
};
