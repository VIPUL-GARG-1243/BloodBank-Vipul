import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loaderReducer from "./loaderSlice";

const store = configureStore({
    reducer: {
        users: userReducer,
        loaders: loaderReducer
    }
})

export default store;