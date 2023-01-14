import { ReactNode } from 'react';

export interface BaseButtonProps {
  /** Button text */
  children: ReactNode;
  onClick?: () => void;
}
