import { ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { Entry as Item } from "components/item";
import { useState } from "react";
import styled from "styled-components";
import { Action } from "utils/reducer";

const Container = styled.section`
  width: 100%;
  border: solid gray 1px;
  padding: 1em;
  display: flex;
  flex-direction: column;
`;

const SubTotal = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled.input`
  color: ${(props) => props.theme.baseFont.color};
  font-weight: bold;
  background: none;
  border: none;
  outline: none;
  width: 100%;

  :focus {
    color: ${(props) => props.theme.colors.accent};
  }
`;

interface ReceiptProps extends ReceiptType {
  personIndex: number;
  receiptIndex: number;
  dispatch: React.Dispatch<Action>;
}

export const Receipt: React.FC<ReceiptProps> = ({
  personIndex,
  receiptIndex,
  dispatch,
  items,
  subtotal,
  title,
}) => {
  const handleAddItem = () => {
    dispatch({
      type: "addItem",
      personIndex,
      receiptIndex,
    });
  };

  const [titleState, setTitleState] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.target.value;
    setTitleState(value);
  };

  // todo move
  const blurOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const updateTitle = () => {
    dispatch({
      type: "updateReceipt",
      personIndex,
      receiptIndex,
      receipt: { title: titleState, items, subtotal },
    });
  };

  return (
    <Container>
      <StyledInput
        type="text"
        value={titleState}
        onChange={handleTitleChange}
        onBlur={updateTitle}
        onKeyDown={blurOnEnter}
      />
      {items.map((item, index) => (
        <Item
          key={`${item.title}${item.whose}${item.price}`}
          personIndex={personIndex}
          receiptIndex={receiptIndex}
          itemIndex={index}
          dispatch={dispatch}
          {...item}
        />
      ))}
      <Button onClick={handleAddItem}>Add item</Button>
      <hr />
      <SubTotal>
        <strong>Subtotal</strong>
        <strong>${subtotal.toFixed(2)}</strong>
      </SubTotal>
    </Container>
  );
};
