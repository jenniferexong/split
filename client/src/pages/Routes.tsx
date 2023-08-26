import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import {
  useGetPeople,
  useGetProducts,
  useGetReceipts,
  useGetStores,
} from '../api';
import { Layout } from './Layout';
import { NotFoundPage } from './NotFoundPage';
import { EntryPageData, HistoryPageData, PageUrl } from './types';
import { AnalyticsPage, EntryPage, HistoryPage } from './section';

export const Routes = () => {
  const getProducts = useGetProducts();
  const getStores = useGetStores();
  const getPeople = useGetPeople();
  const getReceipts = useGetReceipts();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          loader: ({ request }) => {
            if (new URL(request.url).pathname === '/') {
              return redirect(PageUrl.Entry);
            }
          },
        },
        {
          path: PageUrl.Entry,
          element: <EntryPage />,
          loader: async (): Promise<EntryPageData> => {
            const products = await getProducts();
            const stores = await getStores();
            const people = await getPeople();

            const data: EntryPageData = {
              products,
              stores,
              people,
            };

            return data;
          },
        },
        {
          path: PageUrl.History,
          element: <HistoryPage />,
          loader: async (): Promise<HistoryPageData> => {
            const receipts = await getReceipts();

            return { receipts };
          },
        },
        {
          path: PageUrl.Analytics,
          element: <AnalyticsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};
