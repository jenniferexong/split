import { Board } from 'components/board/Board';
import { useLoaderData } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

export const HistoryPage = () => {
  const data = useLoaderData();
  console.log('upload data', JSON.stringify(data));

  return (
    <Board>
      <h2>History</h2>
    </Board>
  );
};
HistoryPage.displayName = 'HistoryPage';
