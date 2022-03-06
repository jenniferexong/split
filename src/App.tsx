import { Person } from "components/person";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

export const App: React.FC = () => {
  return (
    <Container>
      <Person>Person 1</Person>
      <Person>Person 2</Person>
    </Container>
  );
};
