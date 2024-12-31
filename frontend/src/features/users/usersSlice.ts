import { GlobalErrorMessage, ValidationError } from '../../types/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  logout,
  register,
} from './usersThunks';
import { RootState } from '../../app/store';
import { User } from '../../types/types.User';

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalErrorMessage | null;
  logOutLoading: boolean;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  logOutLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setRegisterError: (state, { payload: action }) => {
      state.registerError = action;
    },
    setLoginError: (state, { payload: action }) => {
      state.loginError = action;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, { payload: data }) => {
        state.registerLoading = false;
        state.user = data;
      })
      .addCase(register.rejected, (state, { payload: error }) => {
        state.registerLoading = false;
        state.registerError = error || null;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, { payload: data }) => {
        state.loginLoading = false;
        state.user = data;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.logOutLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.logOutLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.logOutLoading = false;
      });
  },
});

export const usersReducer = usersSlice.reducer;
export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectRegisterError = (state: RootState) =>
  state.users.registerError;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const {
  unsetUser,
  setRegisterError,
  setLoginError,
} =
  usersSlice.actions;
