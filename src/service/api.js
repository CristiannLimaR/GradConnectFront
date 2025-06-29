import axios from "axios";
import useAuthStore from "../shared/stores/authStore";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/gradconnect/v1",
  timeout: 5000,
});
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();

    if (token) {
      config.headers["x-token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Iniciar sesión
export const login = async (data) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    const { token, user } = response.data;

    useAuthStore.getState().login(user, token);

    return {
      data: {
        token,
        user,
      },
    };
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};



export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};