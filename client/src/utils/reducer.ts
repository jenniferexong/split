import { isEqual } from 'lodash';
import { AppType, ItemType, ReceiptType } from 'calculator/types';
import produce from 'immer';
import { Reducer } from 'react';
import { unreachable } from './unreachable';
import nibbles from 'images/nibbles.jpg';
import pandy from 'images/pandy.jpg';

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

export const initialState: AppType = {
  people: [
    {
      name: 'Jennifer',
      image: nibbles,
      receipts: [],
    },
    {
      name: 'Andy',
      image: pandy,
      receipts: [],
    },
  ],
};

const emptyItem: ItemType = {
  title: '',
  whose: 'split',
  price: 0,
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
