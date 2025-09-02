import { createAsyncThunk } from '@reduxjs/toolkit';
import { Establishment, EstablishmentTypes } from '../../types/types.Establishments';
import { serverRoute } from '../../utils/constants.ts';
import axiosApi from '../../utils/axiosApi.ts';

export const getEstablishment = createAsyncThunk<EstablishmentTypes[]>(
  'get/establishment',
  async () => {
    try {
      const response = await axiosApi.get(`${serverRoute.establishments}my`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const createEstablishment = createAsyncThunk<void, Establishment>(
  'create/establishment',
  async (data) => {
    try {
      await axiosApi.post(serverRoute.establishments, data);
    } catch (err) {
      console.error(err);
    }
  },
);
