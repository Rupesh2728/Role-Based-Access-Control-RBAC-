import {createSlice} from '@reduxjs/toolkit';

const initialState = {users : {}}
const UsersSlice= createSlice({
    name : 'Users',
    initialState,
    reducers:{
        setusers(state,action){ 
            state.users = action.payload;
        },

        removeusers(state,action){ 
            state.users = {};
        },
    }
});

export const UserSliceactions = UsersSlice.actions;
export default UsersSlice.reducer;

