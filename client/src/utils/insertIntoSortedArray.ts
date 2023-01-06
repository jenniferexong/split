import { sortedIndexBy } from 'lodash';

export const insertIntoSortedArray = <T extends Object>(
  array: T[],
  item: T,
  iteratee: (item: T) => any,
): T[] => {
  const insertIndex = sortedIndexBy(array, item, iteratee);
  array.splice(insertIndex, 0, item);

  return array;
};
