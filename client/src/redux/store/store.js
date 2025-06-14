import { configureStore } from '@reduxjs/toolkit';
import authDataSlice from '../slices/authDataSlice';
import volumeSlice from '../slices/volumeSlice';
import dynamicPaginationSlice from '../slices/dynamicPaginationSlice';
import titlesSlice from '../slices/titlesSlice';
import designsSlice from '../slices/designsSlice';
import resourcesSlice from '../slices/resourcesSlice';

const store = configureStore({
  reducer: {
    authData: authDataSlice,
    volume: volumeSlice,
    dynamicPagination: dynamicPaginationSlice,
    titles: titlesSlice,
    designs: designsSlice,
    resources: resourcesSlice,
  },
});

export default store;
