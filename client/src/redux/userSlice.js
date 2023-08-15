import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        currentUser: null
    },
    reducers: {
        SetCurrentUser(state, action) {
            state.currentUser = action.payload;
        }
    }
})

export const {SetCurrentUser} = userSlice.actions;
export default userSlice.reducer;