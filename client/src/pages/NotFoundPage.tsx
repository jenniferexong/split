import { Board } from '../components/board';
import { Layout } from './Layout';

export const NotFoundPage = () => {
  return (
    <Layout>
      <Board>
        <h2>404 Page not found</h2>
      </Board>
    </Layout>
  );
};
NotFoundPage.displayName = 'NotFoundPage';
