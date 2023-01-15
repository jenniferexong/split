import {
  CreateReceiptInput,
  ReceiptLineInput,
  ReceiptLineSplitInput,
} from 'api/queries';
import { ApiPerson } from 'api/types';
import { EntryData, ItemType, ReceiptType, SplitType } from 'calculator/types';

export const mapEntryDataToReceiptInputs = (
  entryData: EntryData,
): CreateReceiptInput[] => {
  const receiptInputs: CreateReceiptInput[] = [];
  for (const entryPerson of entryData.people) {
    const { person, receipts } = entryPerson;

    if (!person) {
      throw new Error('Cannot create receipt with undefined person');
    }

    receipts.forEach(receipt => {
      receiptInputs.push(mapReceiptToReceiptInput(person, receipt));
    });
  }

  return receiptInputs;
};

const mapReceiptToReceiptInput = (
  person: ApiPerson,
  receipt: ReceiptType,
): CreateReceiptInput => {
  const { store, date, items } = receipt;

  if (!store) {
    throw new Error('Cannot create receipt with undefined store');
  }

  if (!date) {
    throw new Error('Cannot create receipt with undefined date');
  }

  return {
    storeId: store.id,
    date,
    personId: person.id,
    receiptLines: items.map(item => mapItemToReceiptLineInput(item)),
  };
};

const mapItemToReceiptLineInput = (item: ItemType): ReceiptLineInput => {
  const { price, product, splits } = item;

  if (!product) {
    throw new Error('Cannot create receipt line with undefined product');
  }

  return {
    productId: product.id,
    price,
    receiptLineSplits: splits.map(split =>
      mapSplitToReceiptLineSplitInput(split),
    ),
  };
};

const mapSplitToReceiptLineSplitInput = (
  split: SplitType,
): ReceiptLineSplitInput => {
  const { person, antecedent } = split;

  return {
    antecedent,
    personId: person.id,
  };
};
