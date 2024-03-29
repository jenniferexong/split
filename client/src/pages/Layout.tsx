import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { LayoutContextProvider } from './contexts';
import { Header } from './Header';
import { Footer } from './Footer';
import { MENU_BAR_HEIGHT } from '../styles/constants';
import { TabBarMenuButton } from '../components/navigation';

const BoardsContainer = styled.section`
  height: calc(100vh - 2 * ${MENU_BAR_HEIGHT});
  display: flex;
  padding: 0 60px;
  gap: 52px;
  overflow: hidden;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface LayoutProps {
  children?: ReactNode | ReactNode[];
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  const [bottomTabBarButtons, setBottomTabBarButtons] = useState<
    TabBarMenuButton[]
  >([]);

  return (
    <>
      <ToastContainer
        autoClose={3000}
        position="top-center"
        hideProgressBar
        theme="dark"
      />
      <Container>
        <LayoutContextProvider setBottomTabBarButtons={setBottomTabBarButtons}>
          <Header />
          <BoardsContainer>
            {children && children}
            <Outlet />
          </BoardsContainer>
          <Footer buttons={bottomTabBarButtons} />
        </LayoutContextProvider>
      </Container>
    </>
  );
};
Layout.displayName = 'App';
