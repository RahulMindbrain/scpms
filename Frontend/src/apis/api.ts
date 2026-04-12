import axios, { type AxiosRequestConfig } from "axios";

// ─── Base Configuration ───────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3030";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // send httpOnly auth cookie on every request
});

// ─── Request Interceptor – attach Authorization token (from defaults) ────────
// Token is set once via setAuthToken(); no need to read localStorage each time.
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Restore token from localStorage on page reload
const _persistedToken = localStorage.getItem("token");
if (_persistedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${_persistedToken}`;
}

// ─── Auth Token Helper ───────────────────────────────────────────────────────
/** Call after login to inject token; call with null on logout to clear it. */
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
};

// ─── HTTP Helper Functions ────────────────────────────────────────────────────

export const getAPI = async <T>(
    endpoint: string,
    params: any = {},
    headers: AxiosRequestConfig["headers"] = {},
    responseType: AxiosRequestConfig["responseType"] = "json"
): Promise<T> => {
    try {
        const response = await api.get<T>(endpoint, { params, headers, responseType });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data ?? error;
    }
};

export const postAPI = async <T>(
    endpoint: string,
    data: any = {},
    params: any = {},
    headers: AxiosRequestConfig["headers"] = {},
    responseType: AxiosRequestConfig["responseType"] = "json"
): Promise<T> => {
    try {
        const response = await api.post<T>(endpoint, data, { params, headers, responseType });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data ?? error;
    }
};

export const putAPI = async <T>(
    endpoint: string,
    data: any = {},
    params: any = {},
    headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
    try {
        const response = await api.put<T>(endpoint, data, { params, headers });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data ?? error;
    }
};

export const patchAPI = async <T>(
    endpoint: string,
    data: any = {},
    params: any = {},
    headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
    try {
        const response = await api.patch<T>(endpoint, data, { params, headers });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data ?? error;
    }
};

export const deleteAPI = async <T>(
    endpoint: string,
    data: any = {},
    params: any = {},
    headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
    try {
        const response = await api.delete<T>(endpoint, { data, params, headers });
        return response.data;
    } catch (error: any) {
        throw error?.response?.data ?? error;
    }
};

export default api;