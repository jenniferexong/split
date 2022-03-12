import { calculate } from "./calculate";
import { exampleReceipt } from "./exampleData";
import { AppType } from "./types";

describe("calculate", () => {
  const data: AppType = {
    people: [
      {
        name: "Person 1",
        receipts: [
          {
            title: "Countdown",
            items: [
              { whose: "split", price: 550 },
              { whose: "split", price: 440 },
              { whose: "mine", price: 20.5 },
              { whose: "theirs", price: 21.8 },
            ],
            // we don't care about subtotal for this
            subtotal: 0,
          },
        ],
      },
      {
        name: "Person 2",
        receipts: [
          {
            title: "New World",
            items: [
              { whose: "mine", price: 4.56 },
              { whose: "theirs", price: 2.69 },
              { whose: "mine", price: 1.5 },
              { whose: "mine", price: 10.4 },
              { whose: "theirs", price: 1.4 },
              { whose: "split", price: 30.5 },
            ],
            // we don't care about subtotal for this
            subtotal: 0,
          },
        ],
      },
    ],
  };

  describe("calculates the correct information", () => {
    test("case 1", () => {
      const { ower, owee, amount } = calculate(data);
      expect(ower).toBe("Person 2");
      expect(owee).toBe("Person 1");
      expect(amount).toBe(497.46);
    });

    test("case 2", () => {
      const exampleData = {
        people: [
          {
            name: "Person 1",
            receipts: [exampleReceipt],
          },
          {
            name: "Person 2",
            receipts: [exampleReceipt],
          },
        ],
      };
      expect(calculate(exampleData).amount).toBe(0);
    });
  });
});
