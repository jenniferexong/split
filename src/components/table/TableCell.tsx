import { ReactNode } from "react";
import { handleCellKeyDown, onCellFocus } from "components/table";

interface TableCellProps {
  children?: ReactNode;
  as?: "th";
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;

  contentEditable?: boolean;
  colSpan?: number;
  width?: string;
  dir?: string;
}

export const TableCell = (props: TableCellProps) => {
  const { children, onBlur, as, ...rest } = props;

  const setBlur = (e: React.FocusEvent<HTMLTableCellElement, Element>) => {
    onBlur?.(e);
  };

  const Wrapper = as ? "th" : "td";

  return (
    <Wrapper
      onFocus={onCellFocus}
      onBlur={setBlur}
      onKeyDown={handleCellKeyDown}
      {...rest}
    >
      {children}
    </Wrapper>
  );
};
