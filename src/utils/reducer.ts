import { exampleReceipt } from "calculator/exampleData";
import { AppType, ItemType, ReceiptType } from "calculator/types";
import produce from "immer";
import { Reducer } from "react";

export type Action = AddReceipt | AddItem | UpdateItem;

interface AddReceipt {
  type: "addReceipt";
  personIndex: number;
  receipt: ReceiptType;
}

interface AddItem {
  type: "addItem";
  personIndex: number;
  receiptIndex: number;
  item: ItemType;
}

interface UpdateItem {
  type: "updateItem";
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
  item: ItemType;
}

export const initialState: AppType = {
  people: [
    {
      name: "Jennifer",
      receipts: [exampleReceipt],
    },
    {
      name: "Pandy",
      receipts: [exampleReceipt],
    },
  ],
};

export const reducer: Reducer<AppType, Action> = (state, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case "addReceipt": {
        const { personIndex, receipt } = action;
        draft.people[personIndex].receipts.push(receipt);
        break;
      }
      case "addItem": {
        const { personIndex, receiptIndex, item } = action;
        const receipt = draft.people[personIndex].receipts[receiptIndex];

        receipt.items.push(item);
        receipt.subtotal += item.price;

        break;
      }
      case "updateItem": {
        const { personIndex, receiptIndex, itemIndex, item } = action;
        const receipt = draft.people[personIndex].receipts[receiptIndex];

        // handle price change
        receipt.subtotal -= receipt.items[itemIndex].price;
        receipt.items[itemIndex] = item;
        receipt.subtotal += receipt.items[itemIndex].price;
        break;
      }
      default: {
        const _: never = action;
      }
    }
  });
