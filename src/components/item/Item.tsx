import { ItemType, Whose } from 'calculator/types';
import styled from 'styled-components';
import { Action } from 'utils/reducer';
import React from 'react';
import { Icon } from 'components/icon';
import { TableCell } from 'components/table';
import { TableRow } from 'components/table/TableRow';

interface ItemProps extends ItemType {
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
  dispatch: React.Dispatch<Action>;
}

const IconsContainer = styled.div`
  width: 5em;
  display: flex;
  gap: 0.5em;
  align-items: center;
  justify-content: center;
`;

export const Item = (props: ItemProps) => {
  const {
    title,
    whose,
    price,
    personIndex,
    receiptIndex,
    itemIndex,
    dispatch,
  } = props;

  const updateTitle = (e: React.FocusEvent<HTMLTableCellElement>) => {
    dispatch({
      type: 'updateItem',
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title: e.target.innerText, whose, price },
    });
  };

  const updateWhose = (newWhose: Whose) => {
    dispatch({
      type: 'updateItem',
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title, whose: newWhose, price },
    });
  };

  const updatePrice = (e: React.FocusEvent<HTMLTableCellElement>) => {
    const priceText = e.target.innerText;
    // If invalid number, reset value to previous price
    if (!priceText.match(/^\d*\.?\d*$/)) {
      e.target.innerText = price.toFixed(2);
      return;
    }

    dispatch({
      type: 'updateItem',
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title, whose, price: parseFloat(priceText) },
    });
  };

  return (
    <TableRow borderTop={itemIndex === 0}>
      <TableCell contentEditable onBlur={updateTitle} width="55%">
        {title}
      </TableCell>

      <TableCell>
        <IconsContainer>
          <Icon whose="theirs" selected={whose} onClick={updateWhose} />
          <Icon whose="split" selected={whose} onClick={updateWhose} />
          <Icon whose="mine" selected={whose} onClick={updateWhose} />
        </IconsContainer>
      </TableCell>

      <TableCell contentEditable onBlur={updatePrice} width="25%" dir="rtl">
        {price.toFixed(2)}
      </TableCell>
    </TableRow>
  );
};
Item.displayName = 'Item';
