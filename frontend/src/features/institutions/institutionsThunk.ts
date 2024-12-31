import { createAsyncThunk } from '@reduxjs/toolkit';
import { Institution, InstitutionTypes } from '../../types/types.Institution';
import { serverRoute } from '../../utils/constants.ts';
import axiosApi from '../../utils/axiosApi.ts';

export const getInstitutions = createAsyncThunk<InstitutionTypes[]>(
  'get/institutions',
  async () => {
    try {
      const response = await axiosApi.get(serverRoute.institutions);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const createInstitution = createAsyncThunk<void, Institution>(
  'create/institution',
  async (data) => {
    try {
      await axiosApi.post(serverRoute.institutions, data);
    } catch (err) {
      console.error(err);
    }
  },
);
