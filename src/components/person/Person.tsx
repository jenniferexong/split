import { exampleReceipt } from "calculator/exampleData";
import { PersonType, ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { Receipt } from "components/receipt";
import { ReactElement, ReactNode, useState } from "react";
import styled from "styled-components";
import { Action } from "utils/reducer";

const Container = styled.div`
  width: 100%;

  // todo
  display: flex;
  flex-direction: column;

  border: solid grey 1px;
  gap: 1em;
  padding: 20px;

  & > *:last-child {
    margin-bottom: 0;
  }
`;

interface PersonProps extends PersonType {
  personIndex: number;
  dispatch: React.Dispatch<Action>;
}

export const Person: React.FC<PersonProps> = ({
  name,
  receipts,
  personIndex,
  dispatch,
}) => {
  const handleAddReceipt = () => {
    dispatch({
      type: "addReceipt",
      personIndex,
      receipt: {
        title: "",
        items: [],
        subtotal: 0,
      },
    });
  };

  return (
    <Container>
      <h1>{name}</h1>
      {receipts.map((receipt, index) => (
        <Receipt
          key={`${receipt.title}${index}`}
          personIndex={personIndex}
          receiptIndex={index}
          dispatch={dispatch}
          {...receipt}
        />
      ))}
      <Button onClick={handleAddReceipt}>Add receipt</Button>
    </Container>
  );
};
