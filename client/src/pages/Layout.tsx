import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { TabBarMenu } from 'components/navigation/TabBarMenu';
import { ReactNode } from 'react';

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

export const Layout = (props: LayoutProps) => {
  const { children } = props;

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
        <TabBarMenu position="top" />
        <BoardsContainer>
          {children && children}
          <Outlet />
        </BoardsContainer>
        <TabBarMenu position="bottom" />
      </Container>
    </>
  );
};
Layout.displayName = 'App';
