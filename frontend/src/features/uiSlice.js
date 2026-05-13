import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isAuthOpen: false,
  },
  reducers: {
    openAuth: (state) => {
      state.isAuthOpen = true;
    },
    closeAuth: (state) => {
      state.isAuthOpen = false;
    },
  },
});

export const { openAuth, closeAuth } = uiSlice.actions;
export default uiSlice.reducer;
