import { createSlice } from "@reduxjs/toolkit";

export const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    ToggleIsOpen: false,
  },
  reducers: {
    openToggle: (state) => {
      state.ToggleIsOpen = true;
      console.log(state.ToggleIsOpen)
    },
    closedToggle: (state) => {
      state.ToggleIsOpen = false;
      console.log(state.ToggleIsOpen)

    },
  },
});


export const {openToggle, closedToggle } = toggleSlice.actions;

export const selectToggleIsOpen = (state) => state.toggle.ToggleIsOpen;

export default toggleSlice.reducer;