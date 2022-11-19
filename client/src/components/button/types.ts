import { ReactNode } from 'react';

export interface ButtonProps {
  /** Button text */
  children: ReactNode;
  onClick(): void;
}
