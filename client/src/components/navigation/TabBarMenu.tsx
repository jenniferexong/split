import { TabBarButton } from 'components/button';
import { PageUrl } from 'pages/types';
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
      <TabBarButton to={PageUrl.Entry} position={position}>
        Entry
      </TabBarButton>
      <TabBarButton to={PageUrl.History} position={position}>
        History
      </TabBarButton>
      <TabBarButton to={PageUrl.Analytics} position={position}>
        Analytics
      </TabBarButton>
    </Container>
  );
};
TabBarMenu.displayName = 'TabBarMenu';
