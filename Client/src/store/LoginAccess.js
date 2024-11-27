import { createSlice } from "@reduxjs/toolkit";

const persistedState = JSON.parse(localStorage.getItem("LoginAccess")) || { access: {} };

const LoginAccess = createSlice({
  name: "LoginAccess",
  initialState: persistedState,
  reducers: {
    setaccess(state, action) {
      state.access = action.payload;
      localStorage.setItem("LoginAccess", JSON.stringify(state)); 
    },
    removeaccess(state) {
      state.access = {};
      localStorage.removeItem("LoginAccess");
    },
  },
});

export const LoginAccessActions = LoginAccess.actions;
export default LoginAccess.reducer;
