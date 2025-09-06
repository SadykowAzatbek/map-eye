import { EstablishmentApi } from '../../types/types.Establishments';
import { createSlice } from '@reduxjs/toolkit';
import { createEstablishment, getEstablishment } from './EstablishmentThunk.ts';
import { RootState } from '../../app/store.ts';

interface MapState {
  establishments: EstablishmentApi[];
  isLoading: boolean;
  createIsLoading: boolean;
}

const initialState: MapState = {
  establishments: [],
  isLoading: false,
  createIsLoading: false,
}

export const establishmentSlice = createSlice({
  name: 'establishments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEstablishment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEstablishment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.establishments = action.payload;
      })
      .addCase(getEstablishment.rejected, (state) => {
        state.isLoading = false;
      })

    builder
      .addCase(createEstablishment.pending, (state) => {
        state.createIsLoading = true;
      })
      .addCase(createEstablishment.fulfilled, (state) => {
        state.createIsLoading = false;
      })
      .addCase(createEstablishment.rejected, (state) => {
        state.createIsLoading = false;
      })
  },
});

export const establishmentReducer = establishmentSlice.reducer;
export const selectEstablishments = (state: RootState) => state.establishments.establishments;
export const selectLoadingEstablishments = (state: RootState) => state.establishments.isLoading;
export const selectCreateIsLoadingEstablishments = (state: RootState) => state.establishments.createIsLoading;