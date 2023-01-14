import { ReactElement, ReactNode } from 'react';

export interface BaseModalProps {
  show: boolean;
  handleClose: () => void;
  footerContent?: ReactElement;
  children: ReactNode | ReactNode[];
}

export type ModalProps = Pick<BaseModalProps, 'show' | 'handleClose'>;
