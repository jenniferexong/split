import { ApiPerson } from 'api';

export const hasSelectedAllPeople = (
  people: (ApiPerson | undefined)[],
): people is ApiPerson[] => {
  return people.every(person => !!person);
};
