import { ItemType, Whose } from 'calculator/types';
import styled from 'styled-components';
import { Action } from 'utils/reducer';
import React, { useCallback, useState } from 'react';
import { TableCell } from 'components/table';
import { TableRow } from 'components/table/TableRow';
import { ApiPerson, useCreateProduct } from 'api';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import { ActionMeta } from 'react-select';
import { ProductOption, Select } from 'components/select';
import { Icon } from 'components/icon';
import { mapWhoseToSplits } from 'utils/splits';

interface ItemProps extends ItemType {
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

  const updatePrice = (e: React.FocusEvent<HTMLTableCellElement>) => {
    const priceText = e.target.innerText;
    // If invalid number, reset value to previous price
    if (!priceText.match(/^-?\d*\.?\d*$/)) {
      e.target.innerText = price.toFixed(2);
      return;
    }

    dispatch({
      type: 'updateItem',
      personIndex,
      receiptIndex,
      itemIndex,
      item: { product, splits, price: parseFloat(priceText) },
    });
  };

  const handleCreateOption = useCallback(
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

  const handleChangeOption = useCallback(
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

  return (
    <TableRow borderTop={itemIndex === 0}>
      <TableCell width="55%">
        <Select
          placeholder="..."
          options={productOptions}
          value={productOptionValue}
          onChangeOption={handleChangeOption}
          onCreateOption={handleCreateOption}
        />
      </TableCell>

      <TableCell>
        <IconsContainer>
          <Icon whose="theirs" selected={whose} onClick={updateWhose} />
          <Icon whose="split" selected={whose} onClick={updateWhose} />
          <Icon whose="mine" selected={whose} onClick={updateWhose} />
        </IconsContainer>
      </TableCell>

      <TableCell
        contentEditable
        onBlur={updatePrice}
        width="23%"
        textAlign="right"
      >
        {price.toFixed(2)}
      </TableCell>
    </TableRow>
  );
};
Item.displayName = 'Item';
