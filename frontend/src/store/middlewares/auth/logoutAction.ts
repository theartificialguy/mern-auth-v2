import { createAsyncThunk } from "@reduxjs/toolkit";

export const logoutAction = createAsyncThunk("logoutAction", async () => {
  try {
    const response = await fetch("http://localhost:5001/api/v1/users/logout", {
      method: "POST",
      credentials: "include", // sends all the cookies to server
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message ?? "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
});
