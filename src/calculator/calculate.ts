import { AppType, PersonType } from "./types";

/**
 * Calculates who owes who, and how much is owed.
 *
 * NOTE only works with two people
 */
export const calculate = (
  data: AppType
): { ower: string; owee: string; amount: number } => {
  if (data.people.length !== 2) throw new Error("Two people required");

  const person1 = {
    name: data.people[0].name,
    owings: calculateOwings(data.people[1]),
  };

  const person2 = {
    name: data.people[1].name,
    owings: calculateOwings(data.people[0]),
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
const calculateOwings = (person: PersonType): number => {
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
