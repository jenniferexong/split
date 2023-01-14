import { sortedIndexBy } from 'lodash';

export const insertIntoSortedArray = <T extends Object>(
  array: T[],
  item: T,
  iteratee: (item: T) => any,
): T[] => {
  const newArray = [...array];
  const insertIndex = sortedIndexBy(newArray, item, iteratee);
  newArray.splice(insertIndex, 0, item);

  return newArray;
};
