import { Button } from 'components/button';
import { Input } from 'components/input';
import { ModalBase, ModalProps } from 'components/modal';
import { ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';

const ContentContainer = styled.div`
  width: 556px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FieldsContainer = styled.div`
  width: 80%;
  margin-top: 40px;

  & > *:not(:last-child) {
    margin-bottom: 56px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const CreatePersonModal = (props: ModalProps) => {
  const { show, handleClose } = props;

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setLastName(e.target.value);
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setEmail(e.target.value);
  };

  const handleCreatePerson = useCallback(() => {
    // TODO
  }, []);

  return (
    <ModalBase
      show={show}
      handleClose={handleClose}
      footerContent={
        <ButtonContainer>
          <Button mode="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreatePerson}>Create</Button>
        </ButtonContainer>
      }
    >
      <ContentContainer>
        <h1>Create person</h1>
        <FieldsContainer>
          <Input
            name="First name"
            label="First name"
            value={firstName}
            placeholder="Enter first name"
            onChange={handleChangeFirstName}
          />
          <Input
            name="Last name"
            label="Last name"
            value={lastName}
            placeholder="Enter last name"
            onChange={handleChangeLastName}
          />
          <Input
            name="Email"
            label="Email"
            value={email}
            placeholder="Enter email"
            onChange={handleChangeEmail}
          />
        </FieldsContainer>
      </ContentContainer>
    </ModalBase>
  );
};
CreatePersonModal.displayName = 'CreatePersonModal';
