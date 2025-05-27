import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PostgresApi from '../../services/PostgresApi';

const postgresApi = new PostgresApi();

export const getCandidateLogin = createAsyncThunk(
  'authData/login',
  async (candidate, { rejectWithValue }) => {
    try {
      return await postgresApi.sendCandidateLogin(candidate);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Добавляем экшен для выхода
export const logout = createAsyncThunk(
  'authData/logout',
  async (_, { dispatch }) => {
    //await postgresApi.makeRequest('/api/auth/logout') // Если есть endpoint для logout
    dispatch(clearAuthState());
  }
);

const authDataSlice = createSlice({
  name: 'authData',
  initialState: { token: null, user: null, loading: false, error: null },
  reducers: {
    clearAuthState: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(getCandidateLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCandidateLogin.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      state.loading = false;
    });
    builder.addCase(getCandidateLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      // state.error = payload;
    });
    builder.addCase(logout.fulfilled, (state) => {
      // Очистка состояния уже сделана в clearAuthState
    });
  },
});

export const { clearAuthState } = authDataSlice.actions;
export default authDataSlice.reducer;
