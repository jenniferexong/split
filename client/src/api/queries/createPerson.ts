import { gql, useMutation } from 'urql';
import { PersonResult } from './types';

interface CreatePersonVariables {
  input: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const query = gql<PersonResult, CreatePersonVariables>`
  mutation ($input: CreatePersonInput!) {
    person(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const useCreatePerson = () => {
  const [result, updateResult] = useMutation<
    PersonResult,
    CreatePersonVariables
  >(query);

  const { fetching } = result;

  const createPerson = async (input: CreatePersonVariables['input']) => {
    input.email = input.email.toLowerCase();

    const { data, error } = await updateResult({ input });

    if (error || !data) {
      throw error;
    }

    return data.person;
  };

  return { createPerson, fetching };
};
