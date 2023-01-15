import { isEqual } from 'lodash';
import { EntryData, ItemType, ReceiptType } from 'calculator/types';
import produce from 'immer';
import { Reducer } from 'react';
import { unreachable } from './unreachable';
import { ApiPerson } from 'api';
import { createEqualSplits } from './splits';
import { hasSelectedAllPeople } from './hasSelectedAllPeople';

import nibbles from 'images/nibbles.jpg';
import pandy from 'images/pandy.jpg';
import { getStoredEntryData } from 'storage/entryData';
import { getTotalReceipts } from './getTotalReceipts';

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

interface UpdatePerson {
  type: 'updatePerson';
  personIndex: number;
  newPerson: ApiPerson | undefined;
}

interface ClearReceipts {
  type: 'clearReceipts';
}

export const clearReceiptsAction: ClearReceipts = {
  type: 'clearReceipts',
};

interface RemoveItem {
  type: 'removeItem';
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
}

interface RemoveReceipt {
  type: 'removeReceipt';
  personIndex: number;
  receiptIndex: number;
}

export type Action =
  | AddReceipt
  | UpdateReceipt
  | AddItem
  | UpdateItem
  | ClearReceipts
  | UpdatePerson
  | RemoveItem
  | RemoveReceipt;

export const initialState: EntryData = {
  people: [
    {
      person: undefined,
      image: nibbles,
      receipts: [],
    },
    {
      person: undefined,
      image: pandy,
      receipts: [],
    },
  ],
};

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

const entryData = getStoredEntryData();
let receiptSequence = !entryData ? 0 : getTotalReceipts(entryData);

const createEmptyReceipt = (): ReceiptType => ({
  store: undefined,
  date: undefined,
  items: [],
  subtotal: 0,
  sequence: receiptSequence++,
});

export const reducer: Reducer<EntryData, Action> = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'updatePerson': {
        const { personIndex, newPerson } = action;
        draft.people[personIndex].person = newPerson;
        break;
      }
      case 'clearReceipts': {
        draft.people.forEach(person => (person.receipts.length = 0));
        break;
      }
      case 'addReceipt': {
        const { personIndex } = action;
        draft.people[personIndex].receipts.push(createEmptyReceipt());
        break;
      }
      case 'updateReceipt': {
        const { personIndex, receiptIndex, receipt } = action;
        draft.people[personIndex].receipts[receiptIndex] = receipt;
        break;
      }
      case 'removeReceipt': {
        const { personIndex, receiptIndex } = action;
        const receipts = draft.people[personIndex].receipts;
        receipts.splice(receiptIndex, 1);
        break;
      }
      case 'addItem': {
        const { personIndex, receiptIndex } = action;

        const people = draft.people.map(person => person.person);
        if (!hasSelectedAllPeople(people)) {
          throw new Error('Cannot addItem, encountered undefined person');
        }

        const emptyItem = createEmptyItem(people);

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
      case 'removeItem': {
        const { personIndex, receiptIndex, itemIndex } = action;
        console.log('index', itemIndex);
        const items = draft.people[personIndex].receipts[receiptIndex].items;

        items.splice(itemIndex, 1);
        break;
      }
      default: {
        unreachable(action);
      }
    }
  });
