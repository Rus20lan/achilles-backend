import { createSlice } from '@reduxjs/toolkit';

const volumeSlice = createSlice({
  name: 'volume',
  initialState: {
    current: null,
  },
  reducers: {
    setCurrentVolume: (state, { payload }) => {
      state.current = payload;
    },
    remoteCurrentVolume: (state) => {
      state.current = null;
    },
  },
});

export const { setCurrentVolume } = volumeSlice.actions;
export default volumeSlice.reducer;
