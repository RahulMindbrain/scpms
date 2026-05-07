import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchUniversities, 
  fetchAdmins, 
  fetchCompanies, 
  addUniversity, 
  registerAdmin, 
  updateAdminStatus, 
  updateCompanyStatus,
  activateAdmin
} from "../thunks/superAdminThunk";


interface SuperAdminState {
  universities: any[];
  admins: any[];
  companies: any[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  universities: [],
  admins: [],
  companies: [],
  loading: false,
  isSubmitting: false,
  error: null,
};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Universities
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = action.payload;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add University
      .addCase(addUniversity.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(addUniversity.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.universities.push(action.payload);
      })
      .addCase(addUniversity.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Update Admin Status
      .addCase(updateAdminStatus.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateAdminStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { ids, status } = action.payload;
        state.admins = state.admins.map(admin => 
          ids.includes(admin.user.id) ? { ...admin, user: { ...admin.user, status: status ? 'ACTIVE' : 'INACTIVE' } } : admin
        );

      })
      .addCase(updateAdminStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Update Company Status
      .addCase(updateCompanyStatus.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateCompanyStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { ids, status } = action.payload;
        state.companies = state.companies.map(company => 
          ids.includes(company.id) ? { ...company, status: status ? 'ACTIVE' : 'INACTIVE' } : company
        );
      })
      .addCase(updateCompanyStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Activate Admin
      .addCase(activateAdmin.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(activateAdmin.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { ids } = action.payload;
        state.admins = state.admins.map(admin => 
          ids.includes(admin.user.id) ? { ...admin, user: { ...admin.user, status: 'ACTIVE' } } : admin
        );
      })

      .addCase(activateAdmin.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
  },
});


export const { clearError } = superAdminSlice.actions;
export default superAdminSlice.reducer;
