import { InstitutionTypes } from '../../types/types.Institution';
import { createSlice } from '@reduxjs/toolkit';
import { getInstitutions } from './institutionsThunk.ts';
import { RootState } from '../../app/store.ts';

interface MapState {
  myMaps: InstitutionTypes[];
  isLoading: boolean;
}

const initialState: MapState = {
  myMaps: [],
  isLoading: false,
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
  },
});

export const institutionReducer = institutionsSlice.reducer;
export const selectInstitutions = (state: RootState) => state.institutions.myMaps;
export const selectLoadingInstitutions = (state: RootState) => state.institutions.isLoading;