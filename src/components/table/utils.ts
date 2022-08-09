import React from 'react';

export const handleCellKeyDown = (
  e: React.KeyboardEvent<HTMLTableCellElement>,
) => {
  if (e.key !== 'Enter') return;

  e.preventDefault();

  const current = e.target as HTMLElement;
  const next = getNextCell(current);
  if (!next) return;

  const button = next.querySelector('button');
  if (button) {
    current.blur();
    button.click();
  } else {
    current.blur();
    next.focus();
  }
};

const getNextCell = (current: HTMLElement): HTMLElement | null => {
  const table = current.closest('table');

  if (!table) throw new Error('td has no parent table');

  const all = [...table.querySelectorAll('td, th')].filter(
    td => td.hasAttribute('contenteditable') || !!td.querySelector('button'),
  );

  for (let i = 0; i < all.length; i++) {
    if (all[i] === current) return all[i + 1] as HTMLElement;
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

  const all = [...table.querySelectorAll('td')].filter(td =>
    td.hasAttribute('contenteditable'),
  );

  return all[all.length - 2];
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
  selectElementText(e.target);
};
