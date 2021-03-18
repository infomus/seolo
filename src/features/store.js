import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./toggleSlice";
import userReducer from './userSlice'

export default configureStore({
  reducer: {
    toggle: toggleReducer,
    user: userReducer,
  },
});
