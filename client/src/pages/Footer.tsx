import { TabBarMenu, TabBarMenuButton } from 'components/navigation/TabBarMenu';
import styled from 'styled-components';
import { MENU_BAR_HEIGHT } from 'styles/constants';

const FooterContainer = styled.footer`
  z-index: 10;
  height: ${MENU_BAR_HEIGHT};
  position: sticky;
  bottom: 0;

  background: ${props => props.theme.colors.beige};
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

interface FooterProps {
  buttons: TabBarMenuButton[];
}

export const Footer = (props: FooterProps) => {
  const { buttons } = props;

  return (
    <FooterContainer>
      <TabBarMenu position="bottom" buttons={buttons} />
    </FooterContainer>
  );
};
