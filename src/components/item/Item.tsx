import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemType, Whose } from "calculator/types";
import styled from "styled-components";
import {
  faCheck,
  faXmark,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const Info = styled.div`
  width: 6em;
  display: flex;
  margin-left: auto;
  gap: 1em;

  justify-content: space-between;
`;

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

const IconContainer = styled.div`
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon: React.FC<{ whose: Whose }> = ({ whose }) => {
  const icon = icons[whose];
  return (
    <IconContainer>
      <FontAwesomeIcon icon={icon.icon} color={icon.color} />
    </IconContainer>
  );
};

export const Item: React.FC<ItemType> = ({ title, whose, price }) => {
  return (
    <Container>
      <strong>{title ? title : "---"}</strong>
      <Info>
        <Icon whose={whose} />
        <span>${price.toFixed(2)}</span>
      </Info>
    </Container>
  );
};
