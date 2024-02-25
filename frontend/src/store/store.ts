import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "../store/slices/auth";

import { fetchAuthAction } from "./middlewares/auth/fetchAuthAction";
import { loginAction } from "./middlewares/auth/loginAction";
import { logoutAction } from "./middlewares/auth/logoutAction";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export { fetchAuthAction, loginAction, logoutAction };

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
