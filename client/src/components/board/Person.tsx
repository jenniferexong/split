import { ApiPerson } from 'api';
import { PersonOption, Select } from 'components/input';
import { mapPersonToOption, useOptionValue } from 'components/input/utils/';
import { useEntryPageContext } from 'pages/contexts/EntryPageContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionMeta } from 'react-select';
import styled, { css, useTheme } from 'styled-components';
import { fontMixin } from 'styles/mixins';
import { showError } from 'utils/showToast';
import { Paper } from './Paper';

interface PersonProps {
  personIndex: number;
  person: ApiPerson | undefined;
  image?: string;
}

const Name = styled.section`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    > * {
      ${fontMixin(theme.fonts.nameTag)}
      height: min-content;
      width: 100%;
    }
  `}
`;

const InnerContainer = styled.div`
  ${({
    theme: {
      components: {
        nameTag: { frameWidth },
      },
    },
  }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    padding: ${frameWidth} ${frameWidth} 0;
  `}
`;

const Image = styled.img`
  ${({
    theme: {
      components: { nameTag },
    },
  }) => css`
    border-image: none;
    width: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);
    height: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);
    min-height: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);

    background: lightGray;
  `}
`;

// TODO handle creating a person
export const Person = (props: PersonProps) => {
  const { person, personIndex, image } = props;

  const { personOptions, appState, selectedPeople, dispatch } =
    useEntryPageContext();

  const [personOptionValue, setPersonOptionValue] = useOptionValue(
    person,
    mapPersonToOption,
  );

  useEffect(() => {
    setPersonOptionValue(person ? mapPersonToOption(person) : null);
  }, [person, setPersonOptionValue]);

  const {
    components: { nameTag },
  } = useTheme();

  // All other options
  const options = useMemo(
    () =>
      personOptions.filter(
        option => option.data.id !== personOptionValue?.data.id,
      ),
    [personOptionValue?.data.id, personOptions],
  );

  const handleChangeOption = useCallback(
    (option: PersonOption | null, actionMeta: ActionMeta<PersonOption>) => {
      if (actionMeta.action === 'select-option') {
        if (!option?.data) return;

        // if selecting already selected person, swap them.
        if (option.data.id === selectedPeople[personIndex ^ 1]?.id) {
          dispatch({
            type: 'updatePerson',
            personIndex: personIndex ^ 1,
            newPerson: personOptionValue?.data,
          });
        }

        dispatch({
          type: 'updatePerson',
          personIndex,
          newPerson: option.data,
        });

        setPersonOptionValue(option);
      }
    },
    [
      dispatch,
      personIndex,
      personOptionValue?.data,
      selectedPeople,
      setPersonOptionValue,
    ],
  );

  const [personMenuIsOpen, setPersonMenuIsOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    if (appState.people.some(person => person.receipts.length > 0)) {
      showError('Clear receipts before switching person');
      return;
    }

    setPersonMenuIsOpen(true);
  }, [appState.people]);

  const handleClose = () => setPersonMenuIsOpen(false);

  return (
    <Paper width={nameTag.width} height={nameTag.height}>
      <InnerContainer>
        <Image src={image}></Image>
        <Name>
          <Select
            placeholder="Select person"
            value={personOptionValue}
            options={options}
            onChangeOption={handleChangeOption}
            menuIsOpen={personMenuIsOpen}
            onMenuOpen={handleOpen}
            onMenuClose={handleClose}
            isSearchable={false}
          />
        </Name>
      </InnerContainer>
    </Paper>
  );
};
