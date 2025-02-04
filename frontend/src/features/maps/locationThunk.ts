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

export const createMyLocationThunk = createAsyncThunk<
  void,
  { locationData: LocationTypes; locationId: string | null }
>(
  'post/location',
  async ({ locationData, locationId }) => {
    try {
      // если locationId не null то запрос с locationId иначе без него
      const url = locationId ? `${serverRoute.location}${locationId}` : serverRoute.location;
      await axiosApi.post(url, locationData);
    } catch (err) {
      console.error(err);
    }
  }
);

export const changeMyLocationThunk = createAsyncThunk<
  void,
  { locationData: LocationTypes; locId: string; }
>(
  'change/location',
  async ({ locationData, locId }) => {
    try {
      await axiosApi.patch(serverRoute.location + locId, locationData);
    } catch (err) {
      console.error(err);
    }
  },
);
