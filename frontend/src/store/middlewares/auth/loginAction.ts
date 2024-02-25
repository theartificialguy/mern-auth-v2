import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "../../../utils/decodeJWT";
import { TAuth } from "../../../types/auth";

type TActionPayload = {
  email: string;
  password: string;
};

export const loginAction = createAsyncThunk(
  "loginAction",
  async (payload: TActionPayload) => {
    try {
      const response = await fetch("http://localhost:5001/api/v1/users/login", {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Something went wrong");
      }

      if (!data?.accessToken || data.accessToken === "") {
        throw new Error("Could not retrieve access token");
      }

      const decodedUserData = decodeJWT(data.accessToken);
      const userData = {
        data: {
          ...decodedUserData,
          accessToken: data.accessToken,
        },
      } as TAuth;
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Something went wrong");
    }
  }
);
