import { ModalBase, ModalProps } from 'components/modal';
import styled from 'styled-components';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FieldsContainer = styled.div`
  margin-top: 40px;
`;

export const CreatePersonModal = (props: ModalProps) => {
  const { show, handleClose } = props;

  return (
    <ModalBase show={show} handleClose={handleClose}>
      <ContentContainer>
        <h1>Create person</h1>
        <FieldsContainer>
          <h4>First name</h4>
          <input placeholder="Enter first name" />
          <h4>Last name</h4>
          <input placeholder="Enter last name" />
          <h4>Email</h4>
          <input placeholder="Enter email" />
        </FieldsContainer>
      </ContentContainer>
    </ModalBase>
  );
};
CreatePersonModal.displayName = 'CreatePersonModal';
