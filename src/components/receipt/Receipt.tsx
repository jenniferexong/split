import { addItem } from "calculator/addItem";
import { ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { Entry as Item } from "components/item";
import { useState } from "react";
import styled from "styled-components";

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

export const Receipt: React.FC<ReceiptType> = (receipt) => {
  const [useReceipt, setReceipt] = useState<ReceiptType>(receipt);

  const { title, items: entries, subtotal } = useReceipt;

  const handleAddItem = () => {
    setReceipt((oldReceipt) => {
      return addItem(
        { title: "New Item", whose: "mine", price: 5.5 },
        oldReceipt
      );
    });
  };

  return (
    <Container>
      <h2>{title}</h2>
      {entries.map((entry) => (
        <Item key={`${entry.title}${entry.whose}${entry.price}`} {...entry} />
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
