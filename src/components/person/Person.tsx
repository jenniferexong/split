import { exampleReceipt } from "calculator/exampleData";
import { ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { Receipt } from "components/receipt";
import { Receipts } from "components/receipt/Receipts";
import { ReactElement, ReactNode, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  // todo
  display: flex;
  flex-direction: column;

  border: solid grey 1px;
  gap: 1em;
  padding: 20px;
`;

interface PersonProps {
  /** Name of person */
  children: ReactNode;
}

export const Person: React.FC<PersonProps> = ({ children }) => {
  const [receipts, setReceipts] = useState<ReceiptType[]>([exampleReceipt]);
  console.log(receipts);

  const handleAddReceipt = () => {
    setReceipts((oldReceipts) => {
      oldReceipts.push({ title: "New World", entries: [], subtotal: 0 });
      console.log("added receipt");
      console.log(receipts);
      return [...oldReceipts];
    });
  };

  return (
    <Container>
      <h1>{children}</h1>
      <Button onClick={handleAddReceipt}>Add receipt</Button>
      <Receipts receipts={receipts} />
    </Container>
  );
};
