import { configureStore } from "@reduxjs/toolkit";
import authDataSlice from "../slices/authDataSlice";
import volumeSlice from "../slices/volumeSlice";
import dynamicPaginationSlice from "../slices/dynamicPaginationSlice";
import designsSlice from "../slices/designsSlice";

const store = configureStore({
  reducer: {
    authData: authDataSlice,
    volume: volumeSlice,
    dynamicPagination: dynamicPaginationSlice,
    designs: designsSlice,
  },
});

export default store;
