import { FC, ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import { Navigate } from 'react-router-dom';
import { appRoutes } from '../../utils/constants.ts';

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const user = useAppSelector(selectUser);

  const isClient = user?.role === 'client';
  const isEmployee = user?.role !== 'client';

  if (!user) {
    return <Navigate to={appRoutes.login} />;
  } else if (isClient) {
    return children;
  } else if (isEmployee) return children;
  return <Navigate to={appRoutes.home} />;
};

export default ProtectedRoute;
