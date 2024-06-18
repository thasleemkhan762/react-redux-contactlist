import { configureStore } from "@reduxjs/toolkit";
import GetDataReducer from "../Reducer/GetDataSlice";

const store = configureStore({
    reducer: {
        data: GetDataReducer,
    },
})
export default store;