import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../utils/axiosApi';
import { serverRoute } from '../../utils/constants';
import { isAxiosError } from 'axios';
import { unsetUser } from './usersSlice';
import {LoginMutation, RegisterMutation, RegisterResponse, User, UserSecondaryData} from '../../types/types.User';
import { GlobalErrorMessage, ValidationError } from '../../types/types';


export const register = createAsyncThunk<
  User,
  RegisterMutation,
  { rejectValue: ValidationError }
>('users/register', async (registerMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post(serverRoute.users, registerMutation);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 422) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const login = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: GlobalErrorMessage }
>('users/login', async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<User>(
      serverRoute.sessions,
      loginMutation,
    );
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 422) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const logout = createAsyncThunk<void, undefined>(
  'users/logout',
  async (_, { dispatch }) => {
    await axiosApi.delete(serverRoute.sessions);
    dispatch(unsetUser());
  },
);

export const profileEditThunk = createAsyncThunk<
  RegisterResponse,
  UserSecondaryData,
  {
    rejectValue: ValidationError;
  }
>(
  'users/profileEdit',
  async (profileMutation, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Добавляем поля в FormData
      formData.append('email', profileMutation.email);
      formData.append('displayName', profileMutation.displayName);

      // Если есть файл, добавляем его
      if (profileMutation.image) {
        formData.append('image', profileMutation.image);
      }

      const response = await axiosApi.put(
        `${serverRoute.sessions}update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 422) {
        return rejectWithValue(e.response.data);
      }

      throw e;
    }

  },
);
