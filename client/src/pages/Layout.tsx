import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { TabBarMenu, TabBarMenuButton } from 'components/navigation/TabBarMenu';
import { ReactNode, useState } from 'react';
import { PageUrl } from './types';
import { LayoutContextProvider } from './contexts/LayoutContext';

const BoardsContainer = styled.section`
  height: 100%;
  display: flex;
  padding: 20px 60px;
  gap: 52px;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

interface LayoutProps {
  children?: ReactNode | ReactNode[];
}

const navBarButtons: TabBarMenuButton[] = [
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

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  const [bottomTabBarButtons, setBottomTabBarButtons] = useState<
    TabBarMenuButton[]
  >([]);

  return (
    <>
      <ToastContainer
        autoClose={6000}
        position="top-center"
        hideProgressBar
        theme="dark"
        limit={1}
      />
      <Container>
        <LayoutContextProvider setBottomTabBarButtons={setBottomTabBarButtons}>
          <TabBarMenu position="top" buttons={navBarButtons} />
          <BoardsContainer>
            {children && children}
            <Outlet />
          </BoardsContainer>
          <TabBarMenu position="bottom" buttons={bottomTabBarButtons} />
        </LayoutContextProvider>
      </Container>
    </>
  );
};
Layout.displayName = 'App';
