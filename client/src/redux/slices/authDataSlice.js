import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getCandidateLogin = createAsyncThunk(
  'authData',
  async (candidate) => {
    return await postgresApi.sendCandidateLogin(candidate);
  }
);

const authDataSlice = createSlice({
  name: 'authData',
  initialState: { token: null, user: null, loading: false },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCandidateLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCandidateLogin.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      state.loading = false;
    });
    builder.addCase(getCandidateLogin.rejected, (state) => {});
  },
});

export default authDataSlice.reducer;
