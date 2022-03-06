import { ReceiptType } from "calculator/types";
import { Receipt } from "./Receipt";

interface ReceiptsProps {
  receipts: ReceiptType[];
}

export const Receipts: React.FC<ReceiptsProps> = ({ receipts }) => {
  return (
    <>
      {receipts.map((receipt) => (
        <Receipt key={receipt.title} {...receipt} />
      ))}
    </>
  );
};
