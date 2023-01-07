import React from 'react';

export const handleCellKeyDown = (
  e: React.KeyboardEvent<HTMLTableCellElement>,
) => {
  if (e.key !== 'Enter') return;

  e.preventDefault();

  const current = e.target as HTMLElement;
  const nextCell = getNextCell(current);
  if (!nextCell) return;

  const button = nextCell.querySelector('button');
  if (button) {
    current.blur();
    button.click();
  } else {
    current.blur();
    focusTableCell(nextCell);
  }
};

/**
 * Focuses a table cell, or it's child input element if it has one.
 */
export const focusTableCell = (cell: HTMLElement | null) => {
  if (!cell) return;

  // Focus input if it contains one
  const elementToFocus = cell.querySelector('input') || cell;
  elementToFocus.focus();
};

const getNextCell = (current: HTMLElement): HTMLElement | null => {
  const table = current.closest('table');

  if (!table) throw new Error('td has no parent table');

  const all = [...table.querySelectorAll('td, th')].filter(td => {
    return (
      td.hasAttribute('contenteditable') ||
      !!td.querySelector('button') ||
      td.querySelector('input')
    );
  });

  for (let i = 0; i < all.length; i++) {
    if (all[i] === current || all[i].contains(current)) {
      return all[i + 1] as HTMLElement;
    }
  }

  return null;
};

/**
 * Gets the cell that contains the name of the most recently added item.
 */
export const getLastAddedCell = (
  button: HTMLButtonElement | null,
): HTMLElement | null => {
  if (!button) return null;

  const table = button.closest('table');

  if (!table) throw new Error('button has no parent table');

  const all = [...table.querySelectorAll('td')].filter(
    td => td.hasAttribute('contenteditable') || td.querySelector('input'),
  );

  const lastAddedCell = all[all.length - 2];
  const nestedInput = lastAddedCell.querySelector('input');
  return nestedInput || lastAddedCell;
};

export const selectElementText = (elem: HTMLElement) => {
  setTimeout(() => {
    const sel = window.getSelection();
    const range = document.createRange();
    if (sel && range) {
      range.selectNodeContents(elem);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, 0);
};

export const onCellFocus = (e: React.FocusEvent<HTMLTableCellElement>) => {
  if (e.target.nodeName === 'INPUT') return;

  selectElementText(e.target);
};
