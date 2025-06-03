import { InstitutionTypes } from '../../types/types.Institution';
import { createSlice } from '@reduxjs/toolkit';
import {createInstitution, getInstitutions} from './institutionsThunk.ts';
import { RootState } from '../../app/store.ts';

interface MapState {
  myMaps: InstitutionTypes[];
  isLoading: boolean;
  createIsLoading: boolean;
}

const initialState: MapState = {
  myMaps: [],
  isLoading: false,
  createIsLoading: false,
}

export const institutionsSlice = createSlice({
  name: 'institutions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInstitutions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInstitutions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myMaps = action.payload;
      })
      .addCase(getInstitutions.rejected, (state) => {
        state.isLoading = false;
      })

    builder
      .addCase(createInstitution.pending, (state) => {
        state.createIsLoading = true;
      })
      .addCase(createInstitution.fulfilled, (state) => {
        state.createIsLoading = false;
      })
      .addCase(createInstitution.rejected, (state) => {
        state.createIsLoading = false;
      })
  },
});

export const institutionReducer = institutionsSlice.reducer;
export const selectInstitutions = (state: RootState) => state.institutions.myMaps;
export const selectLoadingInstitutions = (state: RootState) => state.institutions.isLoading;
export const selectCreateIsLoadingInstitutions = (state: RootState) => state.institutions.createIsLoading;