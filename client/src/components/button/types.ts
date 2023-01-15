import { ReactNode } from 'react';

export interface BaseButtonProps {
  /** Button text */
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
