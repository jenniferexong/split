import { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { ReceiptInput } from '../input/ReceiptInput';
import { ItemProps } from './Item';
import { SplitType } from '../../calculator';
import { useEntryPageContext } from '../../pages/contexts';

interface AntecedentInputProps {
  itemProps: ItemProps;
  split: SplitType;
}

export const AntecedentInput = (props: AntecedentInputProps) => {
  const {
    itemProps: { personIndex, receiptIndex, itemIndex, product, splits, price },
    split,
  } = props;

  const { dispatch } = useEntryPageContext();

  const [antecedentInput, setAntecedentInput] = useState<string>(
    split.antecedent.toString(),
  );

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setAntecedentInput(e.target.value);
  };

  const updateAntecedent = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const antecedentText = e.target.value;
      // If invalid number, reset value to previous antecedent
      if (!antecedentText.match(/^0*[1-9]\d*$/)) {
        setAntecedentInput(split.antecedent.toString());
        return;
      }

      const newAntecedent = parseInt(antecedentText);
      const updatedSplits = [...splits];
      const splitToUpdate = updatedSplits.findIndex(
        s => s.person.id === split.person.id,
      );

      updatedSplits[splitToUpdate] = {
        ...updatedSplits[splitToUpdate],
        antecedent: newAntecedent,
      };

      dispatch({
        type: 'updateItem',
        personIndex,
        receiptIndex,
        itemIndex,
        item: { product, splits: updatedSplits, price },
      });
    },
    [
      dispatch,
      itemIndex,
      personIndex,
      price,
      product,
      receiptIndex,
      split.antecedent,
      split.person.id,
      splits,
    ],
  );

  return (
    <ReceiptInput
      className="antecedent"
      value={antecedentInput}
      onChange={handleChangeInput}
      onBlur={updateAntecedent}
    />
  );
};
AntecedentInput.displayName = 'AntecdentInput';
