import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/auth/login",
        data,
        { withCredentials: true } // important for cookies
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);