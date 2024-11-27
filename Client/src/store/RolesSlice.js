import {createSlice} from '@reduxjs/toolkit';

const initialState = {roles : {}}
const RolesSlice= createSlice({
    name : 'roles',
    initialState,
    reducers:{
        setroles(state,action){ 
            state.roles = action.payload;
        },

        removeroles(state,action){ 
            state.roles = {};
        },
    }
});

export const RolesSliceactions = RolesSlice.actions;
export default RolesSlice.reducer;

