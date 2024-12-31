import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Register from '../features/users/Register';
import Login from '../features/users/Login';
import { appRoutes } from '../utils/constants';
import NotFound from '../components/UI/NotFound/NotFound';
import Map from '../features/maps/Map.tsx';
import CreateInstitution from '../features/institutions/CreateInstitution.tsx';

export const router = createBrowserRouter([
  {
    path: appRoutes.home,
    element: <Layout />,
    children: [
      {
        path: appRoutes.home,
        element: <Map />,
      },
      {
        path: appRoutes.register,
        element: <Register />,
      },
      {
        path: appRoutes.login,
        element: <Login />,
      },
      {
        path: appRoutes.notFound,
        element: <NotFound />,
      },
      {
        path: appRoutes.createInstitution,
        element: <CreateInstitution />,
      }
    ],
  },
]);