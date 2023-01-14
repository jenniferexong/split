import { useGetPeople, useGetProducts, useGetStores } from 'api';
import { Layout } from 'pages/Layout';
import { AnalyticsPage, EntryPage, HistoryPage } from 'pages/section';
import { NotFoundPage } from 'pages/NotFoundPage';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { EntryPageData, PageUrl } from './types';

export const Routes = () => {
  const getProducts = useGetProducts();
  const getStores = useGetStores();
  const getPeople = useGetPeople();

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
