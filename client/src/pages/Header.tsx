import { TabBarMenu, TabBarMenuButton } from 'components/navigation/TabBarMenu';
import styled from 'styled-components';
import { MENU_BAR_HEIGHT } from 'styles/constants';
import { PageUrl } from './types';

const navigationButtons: TabBarMenuButton[] = [
  {
    label: 'Entry',
    to: PageUrl.Entry,
  },
  {
    label: 'History',
    to: PageUrl.History,
  },
  {
    label: 'Analytics',
    to: PageUrl.Analytics,
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
