import { useGetPeople, useGetProducts, useGetStores } from 'api';
import { Layout } from 'pages/Layout';
import { UploadPage } from 'pages/boards';
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
      children: [
        {
          index: true,
          loader: ({ request }) => {
            if (new URL(request.url).pathname === '/') {
              return redirect('/upload');
            }
          },
        },
        {
          path: 'upload',
          element: <UploadPage />,
          loader: async () => {
            const products = await getProducts();
            const people = await getStores();
            const stores = await getPeople();

            return json({ products, people, stores }, { status: 200 });
          },
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};
