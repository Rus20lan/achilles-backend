import { configureStore } from '@reduxjs/toolkit';
import authDataSlice from '../slices/authDataSlice';
import volumeSlice from '../slices/volumeSlice';

const store = configureStore({
  reducer: {
    authData: authDataSlice,
    volume: volumeSlice,
  },
});

export default store;
