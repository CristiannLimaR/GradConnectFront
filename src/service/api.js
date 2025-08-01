import axios from "axios";
import useAuthStore from "../shared/stores/authStore";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/gradConnect/v1",
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();

    if (token) config.headers["x-token"] = token;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const login = async (data) => {
  try {
    const res = await apiClient.post("/auth/login", data);
    const { token, user } = res.data;
    useAuthStore.getState().login(user, token);
    return { data: { token, user } };
  } catch (e) {
    return { error: true, e };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (e) {
    return { error: true, e };
  }
};

export const updateProfile = async (formData) => {
  const id = useAuthStore.getState().getUser().id;
  try {
    const res = await apiClient.put(`/user/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { updatedUser: res.data.user };
  } catch (e) {
    return { error: true, e };
  }
};

export const changePassword = async (id, passwordData) => {
  try {
    const response = await fetch(`/api/users/updatePassword/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData)
    });
    return await response.json();
  } catch (e) {
    return { error: true, e };
  }
};

export const adminUpdateUser = async (id, data) => {
  try {
    return await apiClient.put(`/user/${id}`, data, {
      headers: data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {},
    });
  } catch (e) {
    return { error: true, e };
  }
};

export const adminDeleteUser = async (id) => {
  try {
    return await apiClient.delete(`/user/${id}`);
  } catch (e) {
    return { error: true, e };
  }
};

export const saveExperience = async (data) => {
  try {
    const response = await apiClient.post("/experience/save/", data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, e };
  }
};


export const getExperience = async () => {
  try {
    const response = await apiClient.get("/experience");
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, e };
  }
};

export const updateExperience = async (experienceId, data) => {
  try {
    const response = await apiClient.put(`/experience/update/${experienceId}`, data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, e };
  }
};

export const deleteExperience = async (experienceId) => {
  try {
    const response = await apiClient.delete(`/experience/delete/${experienceId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, e };
  }
};

export const saveSkills = async (data) => {
  try {
    const response = await apiClient.post("/skills", data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getSkills = async (userId) => {
  try {
    const response = await apiClient.get(`/skills/user/${userId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};


// ##### wOffers #####
export const getWOffers = async (data) => {
  try {
    return await apiClient.get(`/wOffer/`, data);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const searchWOffer = async (id) => {
  try {
    return await apiClient.get(`/wOffer/search/${id}`);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const saveWOffer = async (formData) => {
  try {
    return await apiClient.post(`/wOffer/save`, formData);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const editWOffer = async (id, data) => {
  try {
    return await apiClient.put(`/wOffer/update/${id}`, data);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const deleteWOffer = async (id) => {
  try {
    return await apiClient.delete(`/wOffer/delete/${id}`);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const getOffersByEnterprise = async (enterpriseId) => {
  try {
    return await apiClient.get(
      `/wOffer/search/woffers/enterprise/${enterpriseId}`
    );
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

// ##### Enterprise #####
export const getEnterpriseByRecruiter = async (recruiterId) => {
  try {
    const {data} = await apiClient.get(`/enterprise/recruiter/${recruiterId}`);
    return { data };
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

// ##### Skills #####
export const getAllSkills = async () => {
  try {
    const response = await apiClient.get(`http://localhost:3000/gradConnect/v1/skills/all`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getSkillById = async (skillId) => {
  try {
    const response = await apiClient.get(`/skills/${skillId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const deleteSkill = async (skillId) => {
  try {
    const response = await apiClient.delete(`/skills/${skillId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const updateSkill = async (skillId, data) => {
  try {
    const response = await apiClient.put(`/skills/${skillId}`, data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// ##### Applications #####
export const applyToOffer = async (data) => {
  try {
    const response = await apiClient.post(`/solitudes/`, data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};