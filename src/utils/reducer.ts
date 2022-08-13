import { isEqual } from 'lodash';
import { AppType, ItemType, ReceiptType } from 'calculator/types';
import produce from 'immer';
import { Reducer } from 'react';
import { unreachable } from './unreachable';

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

export type Action = AddReceipt | UpdateReceipt | AddItem | UpdateItem;

export const initialState: AppType = {
  people: [
    {
      name: 'Jennifer',
      receipts: [],
    },
    {
      name: 'Andy',
      receipts: [],
    },
  ],
};

const emptyItem: ItemType = {
  title: '',
  whose: 'mine',
  price: 0,
};

export const reducer: Reducer<AppType, Action> = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'addReceipt': {
        const { personIndex } = action;
        draft.people[personIndex].receipts.push({
          title: 'Untitled',
          items: [],
          subtotal: 0,
        });
        break;
      }
      case 'updateReceipt': {
        const { personIndex, receiptIndex, receipt } = action;
        draft.people[personIndex].receipts[receiptIndex] = receipt;
        break;
      }
      case 'addItem': {
        const { personIndex, receiptIndex } = action;

        // only add a new item if the previous one has been updated
        const items = draft.people[personIndex].receipts[receiptIndex].items;
        if (isEqual(items[items.length - 1], emptyItem)) break;

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
