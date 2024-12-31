import { FC, ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const user = useAppSelector(selectUser);

  const isClient = user?.role === 'client';
  const isEmployee = user?.role !== 'client';

  return children;
};

export default ProtectedRoute;
