import { SerializedError } from "@reduxjs/toolkit";

export type TAuth = {
  error: SerializedError | string | number | null;
  isLoading: boolean;
  data: {
    accessToken: string;
    email: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  } | null;
};
