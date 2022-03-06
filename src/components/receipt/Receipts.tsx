import { exampleReceipt } from "calculator/exampleData";
import { ReceiptType } from "calculator/types";
import { Button } from "components/button";
import { useState } from "react";
import { Receipt } from "./Receipt";

interface ReceiptsProps {
  receipts: ReceiptType[];
}

export const Receipts: React.FC<ReceiptsProps> = ({
  receipts: initialReceipts,
}) => {
  const [receipts, setReceipts] = useState<ReceiptType[]>(initialReceipts);

  const handleAddReceipt = () => {
    setReceipts((oldReceipts) => {
      oldReceipts.push({ title: "New World", items: [], subtotal: 0 });
      console.log("added receipt");
      console.log(initialReceipts);
      return [...oldReceipts];
    });
  };

  return (
    <>
      {receipts.map((receipt) => (
        <Receipt key={receipt.title} {...receipt} />
      ))}
      <Button onClick={handleAddReceipt}>Add receipt</Button>
    </>
  );
};
