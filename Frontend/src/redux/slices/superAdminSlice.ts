import { createSlice } from "@reduxjs/toolkit";

interface SuperAdminState {
  universities: any[];
  admins: any[];

  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  universities: [
    { id: 1, name: "Stanford University", domain: "stanford.edu", contactEmail: "admin@stanford.edu", address: "Stanford, CA", onboardingStatus: "COMPLETED" },
    { id: 2, name: "MIT", domain: "mit.edu", contactEmail: "admin@mit.edu", address: "Cambridge, MA", onboardingStatus: "PENDING_PROFILE" },
    { id: 3, name: "Harvard University", domain: "harvard.edu", contactEmail: "admin@harvard.edu", address: "Cambridge, MA", onboardingStatus: "PENDING_ACCEPTANCE" },
    { id: 4, name: "Oxford University", domain: "ox.ac.uk", contactEmail: "admin@ox.ac.uk", address: "Oxford, UK", onboardingStatus: "COMPLETED" },
  ],
  admins: [
    { id: 1, firstname: "John", lastname: "Doe", email: "john@stanford.edu", status: "ACTIVE", university: { name: "Stanford University" }, onboardingStep: "COMPLETED" },
    { id: 2, firstname: "Jane", lastname: "Smith", email: "jane@mit.edu", status: "ACTIVE", university: { name: "MIT" }, onboardingStep: "CREATE_PROFILE" },
    { id: 3, firstname: "Robert", lastname: "Brown", email: "robert@global.com", status: "INACTIVE", university: null, onboardingStep: "ACTIVATE_ACCOUNT" },
    { id: 4, firstname: "Alice", lastname: "Wilson", email: "alice@harvard.edu", status: "ACTIVE", university: null, onboardingStep: "UNIVERSITY_ACCEPTANCE" },
  ],
  companies: [
    { id: 1, name: "Google", email: "recruitment@google.com", status: "ACTIVE", activationStep: "COMPLETED" },
    { id: 2, name: "Microsoft", email: "hr@microsoft.com", status: "INACTIVE", activationStep: "PENDING_COMPANY_APPROVAL" },
  ],

  loading: false,
  isSubmitting: false,
  error: null,
};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    // Mock actions for local UI updates
    mockAddUniversity: (state, action) => {
      state.universities.push({ ...action.payload, id: Date.now(), onboardingStatus: "PENDING_ACCEPTANCE" });
    },

    mockUpdateAdminStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.admins = state.admins.map(admin => 
        ids.includes(admin.id) ? { 
          ...admin, 
          status: status ? 'ACTIVE' : 'INACTIVE',
          onboardingStep: status && admin.onboardingStep === 'ACTIVATE_ACCOUNT' ? 'UNIVERSITY_ACCEPTANCE' : admin.onboardingStep
        } : admin
      );
    },

    mockUpdateCompanyStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.companies = state.companies.map(company => 
        ids.includes(company.id) ? { ...company, status: status ? 'ACTIVE' : 'INACTIVE', activationStep: status ? 'COMPLETED' : 'PENDING_COMPANY_APPROVAL' } : company
      );
    }
  },
});

export const { 
  setLoading, 
  setSubmitting, 
  mockAddUniversity, 
  mockUpdateAdminStatus,
  mockUpdateCompanyStatus
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
