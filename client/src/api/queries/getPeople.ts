import { ApiPerson } from 'api/types';
import { gql, useQuery } from 'urql';
import { showError } from 'utils/showError';
import { PeopleResult, QueryResult } from './types';

const query = gql`
  query {
    people {
      id
      firstName
      lastName
      email
    }
  }
`;

export const useGetPeople = (): QueryResult<ApiPerson[]> => {
  const [result] = useQuery<PeopleResult, {}>({ query });
  const { data, fetching, error } = result;

  if (fetching) return { fetching };
  if (error) showError('Could not get people', error);

  return { data: data?.people, fetching };
};
