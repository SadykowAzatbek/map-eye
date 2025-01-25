import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocationTypes } from '../../types/types.Location.ts';
import axiosApi from '../../utils/axiosApi.ts';
import { serverRoute } from '../../utils/constants.ts';

export const getMyLocationThunk = createAsyncThunk<LocationTypes, string>(
  'get/location',
  async (id: string) => {
    try {
      const response = await axiosApi.get(serverRoute.location + id);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  },
);

export const createMyLocationThunk = createAsyncThunk<void, { locationData: LocationTypes, locationId: string }>(
  'post/location',
  async ({ locationData, locationId })=> {
    try {
      await axiosApi.post(serverRoute.location + locationId, locationData);
    } catch (err) {
      console.error(err);
    }
  },
);
