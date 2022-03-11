import { ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { Entry as Item } from "components/item";
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
      item: { whose: "mine", price: 5.5 },
    });
  };

  return (
    <Container>
      <h2>{title}</h2>
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
