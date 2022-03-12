import { AppType, PersonType } from "./types";

/**
 * Calculates who owes who, and how much is owed.
 *
 * NOTE only works with two people
 */
export const calculateOwings = (
  data: AppType
): { ower: string; owee: string; amount: number } => {
  if (data.people.length !== 2) throw new Error("Two people required");

  const person1 = {
    name: data.people[0].name,
    owings: calculateOwing(data.people[1]),
  };

  const person2 = {
    name: data.people[1].name,
    owings: calculateOwing(data.people[0]),
  };

  let ower;
  let owee;
  if (person1.owings > person2.owings) {
    ower = person1;
    owee = person2;
  } else {
    ower = person2;
    owee = person1;
  }

  return {
    ower: ower.name,
    owee: owee.name,
    amount: ower.owings - owee.owings,
  };
};

/**
 * Calculates the amount the other person owes to this person
 */
const calculateOwing = (person: PersonType): number => {
  let owings = 0;
  for (let receipt of person.receipts) {
    for (let item of receipt.items) {
      if (item.whose === "split") {
        owings += item.price / 2;
      } else if (item.whose === "theirs") {
        owings += item.price;
      }
    }
  }
  return owings;
};

export const calculateSpendings = ({
  people,
}: AppType): { name: string; spendings: number }[] => {
  const spendings1 = calculateSpending(people[0]);
  const spendings2 = calculateSpending(people[1]);

  return [
    {
      name: people[0].name,
      spendings: spendings1.mySpendings + spendings2.theirSpendings,
    },
    {
      name: people[1].name,
      spendings: spendings2.mySpendings + spendings1.theirSpendings,
    },
  ];
};

/**
 * Calculates the total spendings made by each person,
 * for receipts paid by a given person
 */
const calculateSpending = (
  person: PersonType
): { mySpendings: number; theirSpendings: number } => {
  let mySpendings = 0;
  let theirSpendings = 0;
  for (let receipt of person.receipts) {
    for (let { whose, price } of receipt.items) {
      if (whose === "mine") {
        mySpendings += price;
      } else if (whose === "split") {
        mySpendings += price / 2;
        theirSpendings += price / 2;
      } else {
        theirSpendings += price;
      }
    }
  }
  return { mySpendings, theirSpendings };
};
