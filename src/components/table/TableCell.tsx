import { ReactNode } from "react";
import { handleCellKeyDown, onCellFocus } from "components/table";

interface TableCellProps {
  children?: ReactNode;
  colSpan?: number;
  as?: "th";
  contentEditable?: boolean;
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;
}

export const TableCell = (props: TableCellProps) => {
  const { children, onBlur, contentEditable, as, colSpan } = props;

  const setBlur = (e: React.FocusEvent<HTMLTableCellElement, Element>) => {
    onBlur?.(e);
  };

  const Wrapper = as ? "th" : "td";

  return (
    <Wrapper
      colSpan={colSpan}
      contentEditable={contentEditable}
      onFocus={onCellFocus}
      onBlur={setBlur}
      onKeyDown={handleCellKeyDown}
    >
      {children}
    </Wrapper>
  );
};