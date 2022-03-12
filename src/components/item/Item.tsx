import { ItemType, Whose } from "calculator/types";
import styled, { css } from "styled-components";
import { Action } from "utils/reducer";
import { useState } from "react";
import { Icon } from "components/icon";

interface ItemProps extends ItemType {
  personIndex: number;
  receiptIndex: number;
  itemIndex: number;
  dispatch: React.Dispatch<Action>;
}

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const Info = styled.div`
  width: 11em;
  display: flex;
  margin-left: auto;
  gap: 1em;

  justify-content: space-between;
`;

const IconsContainer = styled.div`
  width: 5em;
  display: flex;
  gap: 0.5em;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  color: ${(props) => props.theme.baseFont.color};
  background: none;
  border: none;
  outline: none;
  width: 100%;

  :focus {
    color: ${(props) => props.theme.colors.accent};
  }
`;

const Price = styled.div`
  display: flex;
  width: 3em;
`;

export const Item: React.FC<ItemProps> = ({
  title,
  whose,
  price,
  personIndex,
  receiptIndex,
  itemIndex,
  dispatch,
}) => {
  const [titleState, setTitleState] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitleState(e.target.value);
  };

  const updateTitle = () => {
    dispatch({
      type: "updateItem",
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title: titleState, whose, price },
    });
  };

  const updateWhose = (newWhose: Whose) => {
    dispatch({
      type: "updateItem",
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title, whose: newWhose, price },
    });
  };

  const [priceTextState, setPriceTextState] = useState(price.toFixed(2));
  const [priceState, setPriceState] = useState(price);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.target.value;
    setPriceTextState(value);

    // check if it is a valid number
    if (value.match(/^\d*\.?\d*$/)) {
      setPriceState(parseFloat(value));
    }
  };

  const blurOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const updatePrice = () => {
    if (!priceTextState.match(/^\d*\.?\d*$/)) {
      setPriceTextState(priceState.toFixed(2));
      return;
    }

    dispatch({
      type: "updateItem",
      personIndex,
      receiptIndex,
      itemIndex,
      item: { title, whose, price: priceState },
    });
  };

  return (
    <Container>
      <StyledInput
        type="text"
        defaultValue={title ?? "-"}
        onChange={handleTitleChange}
        onBlur={updateTitle}
        onKeyDown={blurOnEnter}
      />
      <Info>
        <IconsContainer>
          <Icon whose="theirs" selected={whose} onClick={updateWhose} />
          <Icon whose="split" selected={whose} onClick={updateWhose} />
          <Icon whose="mine" selected={whose} onClick={updateWhose} />
        </IconsContainer>
        <StyledInput
          type="text"
          value={priceTextState}
          dir="rtl"
          onChange={handlePriceChange}
          onBlur={updatePrice}
          onKeyDown={blurOnEnter}
        />
      </Info>
    </Container>
  );
};
