import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Register from '../features/users/Register';
import Login from '../features/users/Login';
import { appRoutes } from '../utils/constants';
import NotFound from '../components/UI/NotFound/NotFound';
import Map from '../features/maps/Map.tsx';
import CreateEstablishment from '../features/establishment/containers/CreateEstablishment.tsx';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.tsx';
import ClientNavigation from '../features/users/ClientNavigation.tsx';
import Establishment from '../features/establishment/containers/Establishment.tsx';

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
        path: appRoutes.profile,
        element: (
          <ProtectedRoute>
            <ClientNavigation />
          </ProtectedRoute>
        ),
      },
      {
        path: appRoutes.createEstablishment,
        element: (
          <ProtectedRoute>
            <CreateEstablishment />
          </ProtectedRoute>
        ),
      },
      {
        path: appRoutes.myEstablishment,
        element: (
          <ProtectedRoute>
            <Establishment />
          </ProtectedRoute>
        )
      }
    ],
  },
]);