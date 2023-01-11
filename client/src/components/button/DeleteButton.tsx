import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken } from 'polished';
import styled from 'styled-components';
import { transition } from 'styles/mixins';
import { ButtonProps } from './types';

interface DeleteButtonProps extends Omit<ButtonProps, 'children'> {
  isVisible: boolean;
  icon: 'trash' | 'x';
  className?: string;
}

const StyledButton = styled.button<Pick<DeleteButtonProps, 'isVisible'>>`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  background: none;
  padding: 0;

  color: ${({ isVisible }) => (isVisible ? 'silver' : 'transparent')};

  ${transition('color')}

  &:hover {
    color: ${darken(0.2, 'silver')};
  }
`;

export const DeleteButton = (props: DeleteButtonProps) => {
  const { className, isVisible, onClick } = props;

  return (
    <StyledButton
      tabIndex={-1}
      className={className}
      onClick={onClick}
      isVisible={isVisible}
    >
      <FontAwesomeIcon icon={faCircleXmark} />
    </StyledButton>
  );
};
DeleteButton.displayName = 'DeleteButton';
