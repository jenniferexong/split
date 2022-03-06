import { EntryType } from "calculator/types";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const Info = styled.div`
  width: 10em;
  display: flex;
  margin-left: auto;
  gap: 2em;

  justify-content: space-between;
`;

export const Entry: React.FC<EntryType> = ({ title, whose, price }) => {
  return (
    <Container>
      <strong>{title ? title : "---"}</strong>
      <Info>
        <span>{whose}</span>
        <span>${price.toFixed(2)}</span>
      </Info>
    </Container>
  );
};
