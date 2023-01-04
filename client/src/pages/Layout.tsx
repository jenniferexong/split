import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

const BoardContainer = styled.section`
  height: 100%;
  display: flex;
  // TODO
  padding: 40px;
  gap: 40px;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Layout = () => {
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
        <BoardContainer>
          <Outlet />
        </BoardContainer>
      </Container>
    </>
  );
};
Layout.displayName = 'App';
