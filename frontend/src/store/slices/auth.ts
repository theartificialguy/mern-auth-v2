import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { fetchAuthAction, loginAction, logoutAction } from "../store";

import { TAuth } from "../../types/auth";

const initialState: TAuth = {
  data: null,
  error: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch auth action
    builder.addCase(fetchAuthAction.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      fetchAuthAction.fulfilled,
      (state, action: PayloadAction<TAuth>) => {
        state.error = null;
        state.data = action.payload.data;
        state.isLoading = false;
      }
    );

    builder.addCase(fetchAuthAction.rejected, (state, action) => {
      state.data = null;
      state.error = action.error;
      state.isLoading = false;
    });

    // login action
    // builder.addCase(loginAction.pending, (state) => {
    //   state.isLoading = true;
    // });

    builder.addCase(
      loginAction.fulfilled,
      (state, action: PayloadAction<TAuth>) => {
        state.error = null;
        state.data = action.payload.data;
        // state.isLoading = false;
      }
    );

    builder.addCase(loginAction.rejected, (state, action) => {
      state.data = null;
      state.error = action.error;
      // state.isLoading = false;
    });

    // logout action
    // builder.addCase(logoutAction.pending, (state) => {
    //   state.isLoading = true;
    // });

    builder.addCase(logoutAction.fulfilled, (state) => {
      state.error = null;
      state.data = null;
      // state.isLoading = false;
    });

    builder.addCase(logoutAction.rejected, (state, action) => {
      // state.data = null;
      state.error = action.error;
      // state.isLoading = false;
    });
  },
});

export const authReducer = authSlice.reducer;
