import { ChangeEvent, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { ModalBase, ModalProps } from '../modal';
import { useCreatePerson } from '../../api';
import { useEntryPageContext } from '../../pages/contexts';
import { showError, showSuccess } from '../../utils/notification';
import { Button } from '../button';
import { Input } from '../input';

const ContentContainer = styled.div`
  width: 556px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledForm = styled.form`
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

  const formRef = useRef<HTMLFormElement | null>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const { createPerson } = useCreatePerson();
  const { addPersonOption } = useEntryPageContext();

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
    if (!formRef.current?.reportValidity()) return;

    createPerson({ firstName, lastName, email })
      .then(person => {
        addPersonOption(person);
        showSuccess(
          `Created person "${person.firstName}" successfully!`,
          'success-create-person',
        );

        setFirstName('');
        setLastName('');
        setEmail('');
        handleClose();
      })
      .catch(error => {
        showError(
          `Failed to create person: ${(error as Error).message}`,
          'error-create-person',
        );
      });
  }, [addPersonOption, createPerson, email, firstName, handleClose, lastName]);

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
        <StyledForm ref={formRef}>
          <Input
            required
            name="First name"
            label="First name"
            value={firstName}
            placeholder="Enter first name"
            onChange={handleChangeFirstName}
          />
          <Input
            required
            name="Last name"
            label="Last name"
            value={lastName}
            placeholder="Enter last name"
            onChange={handleChangeLastName}
          />
          <Input
            required
            name="Email"
            label="Email"
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={handleChangeEmail}
          />
        </StyledForm>
      </ContentContainer>
    </ModalBase>
  );
};
CreatePersonModal.displayName = 'CreatePersonModal';
