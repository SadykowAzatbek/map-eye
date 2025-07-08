export interface User {
  _id: string;
  email: string;
  role: string;
  displayName: string;
  token: string;
  image: string
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

export interface UserSecondaryData {
  email: string;
  displayName: string;
  image: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
