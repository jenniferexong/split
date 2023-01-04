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
              return redirect('/entry');
            }
          },
        },
        {
          path: 'entry',
          element: <EntryPage />,
          loader: async () => {
            const products = await getProducts();
            const people = await getStores();
            const stores = await getPeople();

            return json({ products, people, stores }, { status: 200 });
          },
        },
        {
          path: 'history',
          element: <HistoryPage />,
        },
        {
          path: 'analytics',
          element: <AnalyticsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};
