import { ItemType, SplitType, Whose } from 'calculator/types';
import styled from 'styled-components';
import { Action } from 'utils/reducer';
import React, { useCallback, useMemo, useState } from 'react';
import { Input, TableCell } from 'components/table';
import { TableRow } from 'components/table/TableRow';
import { ApiPerson, useCreateProduct } from 'api';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import { ActionMeta } from 'react-select';
import { AntecedentInput, ProductOption, Select } from 'components/input';
import { Icon } from 'components/icon';
import { getSplitCost, mapWhoseToSplits } from 'utils/splits';

export interface ItemProps extends ItemType {
  people: ApiPerson[];
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
  dispatch: React.Dispatch<Action>;
}

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
`;

export const Item = (props: ItemProps) => {
  const {
    people,
    product,
    splits,
    price,
    personIndex,
    receiptIndex,
    itemIndex,
    dispatch,
  } = props;

  const { productOptions, addProductOption } = useEntryPageContext();
  const { createProduct } = useCreateProduct();
  const [productOptionValue, setProductOptionValue] =
    useState<ProductOption | null>(null);

  const [whose, setWhose] = useState<Whose>('split');

  const updateWhose = useCallback(
    (newWhose: Whose) => {
      const splits = mapWhoseToSplits(newWhose, personIndex, people);

      dispatch({
        type: 'updateItem',
        personIndex,
        receiptIndex,
        itemIndex,
        item: { product, splits, price },
      });

      setWhose(newWhose);
    },
    [dispatch, itemIndex, people, personIndex, price, product, receiptIndex],
  );

  const [priceInput, setPriceInput] = useState<string>(price.toFixed(2));
  const handleChangePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setPriceInput(e.target.value);
  };

  const updatePrice = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const priceText = e.target.value;
      // If invalid number, reset value to previous price
      if (!priceText.match(/^-?\d*\.?\d*$/)) {
        setPriceInput(price.toFixed(2));
        return;
      }

      const newPrice = parseFloat(priceText);
      dispatch({
        type: 'updateItem',
        personIndex,
        receiptIndex,
        itemIndex,
        item: { product, splits, price: newPrice },
      });

      setPriceInput(newPrice.toFixed(2));
    },
    [dispatch, itemIndex, personIndex, price, product, receiptIndex, splits],
  );

  const handleCreateProductOption = useCallback(
    (inputValue: string) => {
      createProduct(inputValue).then(product => {
        // Updates product options
        const newOption = addProductOption(product);

        dispatch({
          type: 'updateItem',
          personIndex,
          receiptIndex,
          itemIndex,
          item: { product: newOption.data, splits, price },
        });

        setProductOptionValue(newOption);
      });
    },
    [
      addProductOption,
      createProduct,
      dispatch,
      itemIndex,
      personIndex,
      price,
      receiptIndex,
      splits,
    ],
  );

  const handleChangeProductOption = useCallback(
    (option: ProductOption | null, actionMeta: ActionMeta<ProductOption>) => {
      if (actionMeta.action === 'select-option') {
        dispatch({
          type: 'updateItem',
          personIndex,
          receiptIndex,
          itemIndex,
          item: { product: option?.data, splits, price },
        });

        setProductOptionValue(option);
      }
    },
    [dispatch, personIndex, receiptIndex, itemIndex, splits, price],
  );

  // Ensure the split of the person who paid for the receipt is first.
  const sortedSplits: SplitType[] = useMemo(() => {
    const sorted = [...splits];
    // index of the split of the person who paid for this receipt
    const index = sorted.findIndex(
      split => split.person.id === people[personIndex].id,
    );

    sorted.unshift(sorted.splice(index, 1)[0]);
    return sorted;
  }, [people, personIndex, splits]);

  return (
    <>
      <TableRow borderTop={itemIndex === 0}>
        <TableCell width="35%">
          <Select
            placeholder="Untitled"
            options={productOptions}
            value={productOptionValue}
            onChangeOption={handleChangeProductOption}
            onCreateOption={handleCreateProductOption}
          />
        </TableCell>

        <TableCell>
          <IconsContainer>
            <Icon whose="theirs" selected={whose} onClick={updateWhose} />
            <Icon whose="split" selected={whose} onClick={updateWhose} />
            <Icon whose="mine" selected={whose} onClick={updateWhose} />
          </IconsContainer>
        </TableCell>

        <TableCell width="23%" textAlign="right">
          <Input
            value={priceInput}
            onChange={handleChangePriceInput}
            onBlur={updatePrice}
          />
        </TableCell>
      </TableRow>
      {sortedSplits.map(split => (
        <TableRow key={split.person.email}>
          <TableCell textSize="small">
            &emsp;&emsp;&emsp;{split.person.firstName}
          </TableCell>
          <TableCell textSize="small" textAlign="right">
            {splits.length > 1 && (
              <AntecedentInput split={split} itemProps={props} />
            )}
          </TableCell>
          <TableCell textSize="small" textAlign="right">
            {getSplitCost(splits, split.antecedent, price).toFixed(2)}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
Item.displayName = 'Item';
