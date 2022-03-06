import { ReceiptType } from "calculator/types";
import { Entry } from "components/entry";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.section`
  width: 100%;
  border: solid gray 1px;
  padding: 1em;
`;

const SubTotal = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const Receipt: React.FC<ReceiptType> = (receipt) => {
  const [useReceipt, setReceipt] = useState<ReceiptType>(receipt);

  const { title, entries, subtotal } = useReceipt;

  return (
    <Container>
      <h2>{title}</h2>
      {entries.map((entry) => (
        <Entry key={`${entry.title}${entry.whose}${entry.price}`} {...entry} />
      ))}
      <hr />
      <SubTotal>
        <strong>Subtotal</strong>
        <strong>${subtotal}</strong>
      </SubTotal>
    </Container>
  );
};
