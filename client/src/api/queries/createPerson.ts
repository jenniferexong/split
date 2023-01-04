import { gql, useMutation } from 'urql';
import { showError } from 'utils/showError';
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

  const createPerson = (input: CreatePersonVariables['input']) => {
    input.email = input.email.toLowerCase();

    updateResult({ input }).then(({ error }) => {
      if (error) {
        showError(`Could not create person: ${error.graphQLErrors}`);
      }
    });
  };

  return { createPerson, fetching };
};
