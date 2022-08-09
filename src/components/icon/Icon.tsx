import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { lighten } from 'polished';
import {
  faCheck,
  faXmark,
  faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';
import styled, { css } from 'styled-components';
import { Whose } from 'calculator/types';

const icons = {
  mine: {
    icon: faCheck,
    color: 'lime',
  },
  theirs: {
    icon: faXmark,
    color: 'red',
  },
  split: {
    icon: faGripLinesVertical,
    color: 'orange',
  },
};

const IconContainer = styled.div<{ whose: Whose; selected: Whose }>`
  ${({ whose, selected, theme }) =>
    css`
      color: ${whose === selected ? icons[whose].color : theme.colors.disabled};

      :hover {
        ${whose !== selected &&
        css`
          color: ${lighten(0.3, theme.colors.disabled)};
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

  return (
    <IconContainer
      selected={selected}
      whose={whose}
      onClick={() => onClick(whose)}
    >
      <FontAwesomeIcon icon={icons[whose].icon} />
    </IconContainer>
  );
};
Icon.displayName = 'Icon';
