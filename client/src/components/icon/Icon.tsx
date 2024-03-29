import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken } from 'polished';
import {
  faCheck,
  faXmark,
  faGripLinesVertical,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Theme, transition } from '../../styles';
import { Whose } from '../../calculator';

const icons: Record<Whose, IconDefinition> = {
  mine: faCheck,
  theirs: faXmark,
  split: faGripLinesVertical,
};

const getIconColor = (whose: Whose, theme: Theme): string =>
  theme.colors[theme.components.whose[whose]];

const IconContainer = styled.div<{ whose: Whose; selected: Whose }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 12px;

  ${({ whose, selected, theme }) =>
    css`
      color: ${whose === selected
        ? getIconColor(whose, theme)
        : theme.colors.disabled};

      ${transition('color')}
      :hover {
        ${whose !== selected &&
        css`
          color: ${darken(0.3, theme.colors.disabled)};
        `}
      }
    `}
`;

interface IconProps {
  whose: Whose;
  selected: Whose;
  onClick: (whose: Whose) => void;
}

export const Icon = (props: IconProps) => {
  const { whose, selected, onClick } = props;

  const handleClick = useCallback(() => {
    if (whose === selected) {
      return;
    }

    onClick(whose);
  }, [onClick, selected, whose]);

  return (
    <IconContainer selected={selected} whose={whose} onClick={handleClick}>
      <FontAwesomeIcon icon={icons[whose]} />
    </IconContainer>
  );
};
Icon.displayName = 'Icon';
