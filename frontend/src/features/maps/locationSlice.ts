import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { getMyLocationThunk } from './locationThunk.ts';
import { LocationTypes } from '../../types/types.Location.ts';

interface Location {
  myLocation: LocationTypes;
  isLoading: boolean;
}

const initialState: Location = {
  myLocation: {
    location: '',
    city: '',
  },
  isLoading: false,
}

export const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyLocationThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyLocationThunk.fulfilled, (state, { payload: data }) => {
        state.isLoading = false;
        state.myLocation = data;
      })
      .addCase(getMyLocationThunk.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export const locationReducer = locationsSlice.reducer;
export const selectLocation = (state: RootState) => state.locations.myLocation;
