import { createSlice } from "@reduxjs/toolkit";

interface SuperAdminState {
  universities: any[];
  admins: any[];
  professions: any[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  universities: [
    { id: 1, name: "Stanford University", domain: "stanford.edu", contactEmail: "admin@stanford.edu", address: "Stanford, CA" },
    { id: 2, name: "MIT", domain: "mit.edu", contactEmail: "admin@mit.edu", address: "Cambridge, MA" },
    { id: 3, name: "Harvard University", domain: "harvard.edu", contactEmail: "admin@harvard.edu", address: "Cambridge, MA" },
    { id: 4, name: "Oxford University", domain: "ox.ac.uk", contactEmail: "admin@ox.ac.uk", address: "Oxford, UK" },
  ],
  admins: [
    { id: 1, firstname: "John", lastname: "Doe", email: "john@stanford.edu", status: "ACTIVE", university: { name: "Stanford University" } },
    { id: 2, firstname: "Jane", lastname: "Smith", email: "jane@mit.edu", status: "ACTIVE", university: { name: "MIT" } },
    { id: 3, firstname: "Robert", lastname: "Brown", email: "robert@global.com", status: "INACTIVE", university: null },
  ],
  professions: [
    { id: 1, name: "Software Development", description: "Building applications and systems" },
    { id: 2, name: "Data Science", description: "Analyzing data and building models" },
    { id: 3, name: "Cybersecurity", description: "Protecting systems and networks" },
    { id: 4, name: "Product Management", description: "Managing product lifecycle" },
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
      state.universities.push({ ...action.payload, id: Date.now() });
    },
    mockAddProfession: (state, action) => {
      state.professions.push({ ...action.payload, id: Date.now() });
    },
    mockUpdateProfession: (state, action) => {
      const index = state.professions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.professions[index] = { ...state.professions[index], ...action.payload.data };
      }
    },
    mockDeleteProfession: (state, action) => {
      state.professions = state.professions.filter(p => p.id !== action.payload);
    },
    mockUpdateAdminStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.admins = state.admins.map(admin => 
        ids.includes(admin.id) ? { ...admin, status: status ? 'ACTIVE' : 'INACTIVE' } : admin
      );
    }
  },
});

export const { 
  setLoading, 
  setSubmitting, 
  mockAddUniversity, 
  mockAddProfession, 
  mockUpdateProfession, 
  mockDeleteProfession,
  mockUpdateAdminStatus
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
