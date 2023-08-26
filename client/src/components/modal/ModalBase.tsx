import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { BaseModalProps } from './types';
import { Paper } from '../board';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 60px 44px 36px;
  min-width: 550px;
  min-height: 500px;
`;

const ModalFooter = styled.footer`
  width: 100%;

  > * {
    margin: 0;
  }

  padding-top: 52px;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
`;

const StyledPaper = styled(Paper)`
  pointer-events: all;
  .pin {
    width: 44px;
    height: 44px;
  }
`;

export const ModalBase = ({
  show,
  handleClose,
  children,
  footerContent,
}: BaseModalProps) => {
  const handleBackdropClick = () => {
    handleClose?.();
  };

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Backdrop onClick={handleBackdropClick}>
            <motion.div
              key="modal"
              initial={{ transform: 'translateY(50px)' }}
              animate={{ transform: 'translateY(0px)' }}
              exit={{ transform: 'translateY(50px)' }}
              transition={{ duration: 0.2 }}
            >
              <StyledPaper
                background="white"
                width="fit-content"
                onClick={e => e.stopPropagation()}
              >
                <ModalContent onClick={e => e.stopPropagation()}>
                  {children}
                  {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
                </ModalContent>
              </StyledPaper>
            </motion.div>
          </Backdrop>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
ModalBase.displayName = 'ModalBase';
