import { createSlice } from "@reduxjs/toolkit"
import {
  fetchCompanyRequests,
  reapplyUniversity,
  requestUniversity,
  sendJobToUniversity,
} from "../thunks/superadmin/companyUniversityThunk"

interface InitialState {
  requests: any[]
  loading: boolean
}

const initialState: InitialState = {
  requests: [],
  loading: false,
}

const companyUniversitySlice = createSlice({
  name: "companyUniversity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(requestUniversity.pending, (state) => {
        state.loading = true
      })

      .addCase(requestUniversity.fulfilled, (state, action) => {
        state.loading = false
        const createdRequests = Array.isArray(action.payload?.data)
          ? action.payload.data
          : []
        state.requests = [...state.requests, ...createdRequests]
      })

      .addCase(requestUniversity.rejected, (state) => {
        state.loading = false
      })

      .addCase(sendJobToUniversity.pending, (state) => {
        state.loading = true
      })

      .addCase(sendJobToUniversity.fulfilled, (state) => {
        state.loading = false
      })

      .addCase(sendJobToUniversity.rejected, (state) => {
        state.loading = false
      })

      .addCase(reapplyUniversity.pending, (state) => {
        state.loading = true
      })

      .addCase(reapplyUniversity.fulfilled, (state, action) => {
        state.loading = false
        const updatedRequests = Array.isArray(action.payload?.data)
          ? action.payload.data
          : []

        const updatesByUniversityId = new Map(
          updatedRequests.map((req: any) => [req.universityId, req])
        )

        state.requests = state.requests.map(
          (req: any) => updatesByUniversityId.get(req.universityId) ?? req
        )
      })

      .addCase(reapplyUniversity.rejected, (state) => {
        state.loading = false
      })

      .addCase(fetchCompanyRequests.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchCompanyRequests.fulfilled, (state, action) => {
        state.loading = false
        state.requests = Array.isArray(action.payload?.data)
          ? action.payload.data
          : []
      })

      .addCase(fetchCompanyRequests.rejected, (state) => {
        state.loading = false
      })
  },
})

export default companyUniversitySlice.reducer
