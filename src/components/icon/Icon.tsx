import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lighten } from "polished";
import {
  faCheck,
  faXmark,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { Whose } from "calculator/types";

const icons = {
  mine: {
    icon: faCheck,
    color: "lime",
  },
  theirs: {
    icon: faXmark,
    color: "red",
  },
  split: {
    icon: faGripLinesVertical,
    color: "orange",
  },
};

const IconContainer = styled.div<{ whose: Whose; selected: Whose }>`
  ${({ whose, selected, theme }) =>
    css`
      color: ${whose === selected
        ? icons[whose].color
        : theme.components.button.disabledColor};

      :hover {
        ${whose !== selected &&
        css`
          color: ${lighten(0.3, theme.components.button.disabledColor)};
        `}
      }
    `}
`;

export const Icon: React.FC<{
  whose: Whose;
  selected: Whose;
  onClick: (whose: Whose) => void;
}> = ({ whose, selected, onClick }) => {
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
