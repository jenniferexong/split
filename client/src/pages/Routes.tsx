import { useGetPeople, useGetProducts, useGetStores } from 'api';
import { Layout } from 'pages/Layout';
import { AnalyticsPage, EntryPage, HistoryPage } from 'pages/section';
import { NotFoundPage } from 'pages/NotFoundPage';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  json,
} from 'react-router-dom';
import { PageUrl } from './types';

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
          loader: async () => {
            const products = await getProducts();
            const stores = await getStores();
            const people = await getPeople();

            return json({ products, people, stores }, { status: 200 });
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
