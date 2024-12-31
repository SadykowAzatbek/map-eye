export const apiURL = import.meta.env['VITE_API_URL'];

export const serverRoute = {
  users: '/users',
  sessions: '/users/sessions',
  institutions: '/institutions',
};

export const Roles = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'manager' },
  { id: 3, name: 'client' },
];

export const appRoutes = {
  notFound: '*',
  home: '/',
  register: '/register',
  login: '/login',
  profile: '/profile',
  createInstitution: '/institution/create',
};

export const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;