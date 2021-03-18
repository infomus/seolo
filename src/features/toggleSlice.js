import { createSlice } from "@reduxjs/toolkit";

export const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    ToggleIsOpen: false,
  },
  reducers: {
    openToggle: (state,action) => {
      state.ToggleIsOpen = action.payload;
    },
    closedToggle: (state,action) => {
      state.ToggleIsOpen = action.payload;


    },
  },
});


export const {openToggle, closedToggle } = toggleSlice.actions;

export const selectToggleIsOpen = (state) => state.toggle.ToggleIsOpen;

export default toggleSlice.reducer;