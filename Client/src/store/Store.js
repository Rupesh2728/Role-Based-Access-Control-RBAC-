import { configureStore } from "@reduxjs/toolkit";
import  LoginAccessReducer  from "./LoginAccess";
import UsersReducer from './UsersSlice';
import RolesReducer from './RolesSlice';
import HierarchyReducer from './Hierarchy';

const store = configureStore({
  reducer: { access: LoginAccessReducer, users : UsersReducer, roles : RolesReducer,hierarchy:HierarchyReducer},
});

export default store;