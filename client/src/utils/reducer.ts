import { isEqual } from 'lodash';
import { AppType, ItemType, ReceiptType } from 'calculator/types';
import produce from 'immer';
import { Reducer } from 'react';
import { unreachable } from './unreachable';
import { ApiPerson } from 'api';
import { createEqualSplits } from './splits';

interface AddReceipt {
  type: 'addReceipt';
  personIndex: number;
}

interface UpdateReceipt {
  type: 'updateReceipt';
  personIndex: number;
  receiptIndex: number;
  receipt: ReceiptType;
}

interface AddItem {
  type: 'addItem';
  personIndex: number;
  receiptIndex: number;
}

interface UpdateItem {
  type: 'updateItem';
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
  item: ItemType;
}

interface Clear {
  type: 'clear';
}

export const clearAction: Clear = {
  type: 'clear',
};

export type Action = AddReceipt | UpdateReceipt | AddItem | UpdateItem | Clear;

/**
 * Creates a item with no product, with an equal split between each given person.
 */
const createEmptyItem = (people: ApiPerson[]): ItemType => {
  const splits = createEqualSplits(people);

  return {
    product: undefined,
    splits,
    price: 0,
  };
};

const emptyReceipt: ReceiptType = {
  store: undefined,
  date: undefined,
  items: [],
  subtotal: 0,
};

export const reducer: Reducer<AppType, Action> = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'clear': {
        draft.people.forEach(person => (person.receipts.length = 0));
        break;
      }
      case 'addReceipt': {
        const { personIndex } = action;
        draft.people[personIndex].receipts.push(emptyReceipt);
        break;
      }
      case 'updateReceipt': {
        const { personIndex, receiptIndex, receipt } = action;
        draft.people[personIndex].receipts[receiptIndex] = receipt;
        break;
      }
      case 'addItem': {
        const { personIndex, receiptIndex } = action;

        const emptyItem = createEmptyItem(
          draft.people.map(person => person.person),
        );

        // only add a new item if the previous one has been updated
        const items = draft.people[personIndex].receipts[receiptIndex].items;
        if (isEqual(items[items.length - 1], emptyItem)) {
          break;
        }

        const receipt = draft.people[personIndex].receipts[receiptIndex];
        receipt.items.push(emptyItem);
        break;
      }
      case 'updateItem': {
        const { personIndex, receiptIndex, itemIndex, item } = action;
        const receipt = draft.people[personIndex].receipts[receiptIndex];

        // handle price change
        receipt.subtotal -= receipt.items[itemIndex].price;
        receipt.items[itemIndex] = item;
        receipt.subtotal += receipt.items[itemIndex].price;
        break;
      }
      default: {
        unreachable(action);
      }
    }
  });
