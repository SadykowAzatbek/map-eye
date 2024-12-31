export interface User {
  _id: string;
  email: string;
  role: string;
  displayName: string;
  token: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}
