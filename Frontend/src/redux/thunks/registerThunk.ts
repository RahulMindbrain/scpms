import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/users/register",
        data
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);