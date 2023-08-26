import { gql, useClient } from 'urql';
import { PeopleResult, QueryResult } from './types';
import { ApiPerson } from '../types';

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
  const client = useClient();
  const loadData = client.query<PeopleResult>(query, {}).toPromise;

  return async () => {
    const result = await loadData();

    const { data, error } = result;

    if (error || !data) {
      throw new Error(JSON.stringify(error));
    }

    return data.people;
  };
};
