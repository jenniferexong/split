import styled from 'styled-components';
import { PageUrl } from './types';
import { TabBarMenu, TabBarMenuButton } from '../components/navigation';
import { MENU_BAR_HEIGHT } from '../styles/constants';

const navigationButtons: TabBarMenuButton[] = [
  {
    label: 'Entry',
    to: PageUrl.Entry,
  },
  {
    label: 'History',
    to: PageUrl.History,
  },
];

const HeaderContainer = styled.header`
  height: ${MENU_BAR_HEIGHT};
  position: sticky;
  top: 0;

  background: ${props => props.theme.colors.beige};
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <TabBarMenu position="top" buttons={navigationButtons} />
    </HeaderContainer>
  );
};
Header.displayName = 'Header';
