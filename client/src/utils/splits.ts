import { ApiPerson } from 'api';
import { SplitType, Whose } from 'calculator/types';
import { unreachable } from './unreachable';

export const createEqualSplits = (people: ApiPerson[]): SplitType[] =>
  people.map(person => ({
    person,
    antecedent: 1,
  }));

export const mapWhoseToSplits = (
  whose: Whose,
  personIndex: number,
  people: ApiPerson[],
): SplitType[] => {
  switch (whose) {
    case 'mine': {
      return [
        {
          person: people[personIndex],
          antecedent: 1,
        },
      ];
    }
    case 'theirs': {
      // NOTE only works with two people
      return [
        {
          person: people[personIndex ^ 1],
          antecedent: 1,
        },
      ];
    }
    case 'split': {
      return createEqualSplits(people);
    }
    default:
      return unreachable(whose);
  }
};
