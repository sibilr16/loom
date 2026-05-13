import { createSlice } from "@reduxjs/toolkit";

const phoneSlice = createSlice({
  name: "phone",
  initialState: { phoneNumber: null },
  reducers: {
    setPhone: (state, action) => {
      state.phoneNumber = action.payload;
    },
  },
});

export const { setPhone } = phoneSlice.actions;
export default phoneSlice.reducer;
