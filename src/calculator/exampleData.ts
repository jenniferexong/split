import { ReceiptType } from "./types";

export const exampleReceipt: ReceiptType = {
  title: "Countdown",
  items: [
    { title: "Pork", whose: "split", price: 4.56 },
    {
      title: "Carrots",
      whose: "split",
      price: 2.69,
    },
    {
      title: "Apples",
      whose: "mine",
      price: 1.5,
    },
    {
      whose: "theirs",
      price: 10.4,
    },
  ],
  subtotal: 19.15,
};
