import { TabBarButton } from 'components/button';
import styled from 'styled-components';

const Container = styled.nav`
  display: flex;
  width: fit-content;
  gap: 52px;
  padding: 0 40px;
`;

interface Props {
  position: 'top' | 'bottom';
}

export const TabBarMenu = (props: Props) => {
  const { position } = props;

  return (
    <Container>
      <TabBarButton to="entry" position={position}>
        Entry
      </TabBarButton>
      <TabBarButton to="history" position={position}>
        History
      </TabBarButton>
      <TabBarButton to="analytics" position={position}>
        Analytics
      </TabBarButton>
    </Container>
  );
};
TabBarMenu.displayName = 'TabBarMenu';
