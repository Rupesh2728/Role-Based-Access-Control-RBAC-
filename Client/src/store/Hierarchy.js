import {createSlice} from '@reduxjs/toolkit';

const initialState = {hierarchy : {}}
const HierarchySlice= createSlice({
    name : 'hierarchy',
    initialState,
    reducers:{
        sethierarchy(state,action){ 
            state.hierarchy = action.payload;
        },
    }
});

export const HierarchySliceactions = HierarchySlice.actions;
export default HierarchySlice.reducer;

