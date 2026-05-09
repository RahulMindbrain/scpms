import { createAsyncThunk } from "@reduxjs/toolkit"
import { getAPI, postAPI, putAPI } from "@/apis/api"

// FETCH REQUESTS
export const fetchCompanyRequests = createAsyncThunk(
  "company/fetchCompanyRequests",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/company/requests")

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch requests")
    }
  }
)

// SEND REQUEST
export const requestUniversity = createAsyncThunk(
  "company/requestUniversity",

  async (universityIds: number[], { rejectWithValue }) => {
    try {
      const response = await postAPI<any>("/company/request-university", {
        universityIds,
      })

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send request")
    }
  }
)

// REAPPLY REQUEST
export const reapplyUniversity = createAsyncThunk(
  "company/reapplyUniversity",

  async (universityIds: number[], { rejectWithValue }) => {
    try {
      const response = await putAPI<any>("/company/reapply-university", {
        universityIds,
      })

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to reapply request")
    }
  }
)

// SEND JOB TO UNIVERSITY
export const sendJobToUniversity = createAsyncThunk(
  "company/sendJobToUniversity",
  async (
    payload: {
      jobId: number
      jobUniversities: Array<{
        universityId: number
        salary: number
        minCgpa: number
        maxBacklogs: number
        openings: number
        description: string
      }>
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await postAPI<any>("/job-universities/send", payload)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to send job to university"
      )
    }
  }
)
