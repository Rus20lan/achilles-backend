import { configureStore } from '@reduxjs/toolkit';
import authDataSlice from '../slices/authDataSlice';

const store = configureStore({
  reducer: {
    authData: authDataSlice,
  },
});

export default store;
