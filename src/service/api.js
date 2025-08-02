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

export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const saveExperience = async (data) => {
  try {
    const response = await apiClient.post("/experience", data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getExperience = async () => {
  try {
    const response = await apiClient.get("/experience");
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const updateExperience = async (experienceId, data) => {
  try {
    const response = await apiClient.put(`/experience/${experienceId}`, data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const deleteExperience = async (experienceId) => {
  try {
    const response = await apiClient.delete(`/experience/${experienceId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Get experience data for a specific user by userId
export const getExperiencesByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/experience/user/${userId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// ##### Education #####
export const saveEducation = async (data) => {
  try {
    const response = await apiClient.post("/education", data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const getEducations = async () => {
  try {
    const response = await apiClient.get("/education");
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const updateEducation = async (educationId, data) => {
  try {
    const response = await apiClient.put(`/education/${educationId}`, data);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const deleteEducation = async (educationId) => {
  try {
    const response = await apiClient.delete(`/education/${educationId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Get education data for a specific user by userId
export const getEducationsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/education/user/${userId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};


// Obtener estadísticas del dashboard de empresa
export const getCompanyDashboardStats = async (enterpriseId) => {
  try {
    const response = await apiClient.get(`/enterprise/${enterpriseId}/stats`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

// Obtener estadísticas del dashboard de admin
export const getAdminDashboardStats = async () => {
  try {
    const response = await apiClient.get(`/user/admin-stats`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const getUserSkills = async () => {
  try {
    const response = await apiClient.get(`/user/skills/mySkills`);
    return { success: true, data: response.data.skills };
  } catch (e) {
    return { success: false, error: e };
  }
};


export const addUserSkill = async (skillData) => {
  try {
    const response = await apiClient.post(`/user/skills`, skillData);
    return { success: true, data: response.data.skill };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Actualizar habilidad de un usuario
export const updateUserSkill = async (userId, skillId, skillData) => {
  try {
    const response = await apiClient.put(`/user/skills/${skillId}`, skillData);
    return { success: true, data: response.data.skill };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Eliminar habilidad de un usuario
export const deleteUserSkill = async (userId, skillId) => {
  console.log('API deleteUserSkill - userId:', userId);
  console.log('API deleteUserSkill - skillId:', skillId);
  console.log('API deleteUserSkill - URL:', `/user/skills/${skillId}`);
  try {
    const response = await apiClient.delete(`/user/skills/${skillId}`);
    return { success: true, data: response.data.skill };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Buscar habilidades globales
export const searchGlobalSkills = async (query, category = null) => {
  try {
    const params = new URLSearchParams({ query });
    if (category) params.append('category', category);
    
    const response = await apiClient.get(`/skills/search?${params.toString()}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Obtener todas las habilidades globales
export const getAllGlobalSkills = async () => {
  try {
    const response = await apiClient.get(`/skills/global`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Obtener habilidades por categoría
export const getSkillsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/skills/category/${category}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Obtener habilidad global por ID
export const getGlobalSkillById = async (skillId) => {
  try {
    const response = await apiClient.get(`/skills/${skillId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Crear habilidad global (Admin)
export const createGlobalSkill = async (skillData) => {
  try {
    const response = await apiClient.post(`/skills/global`, skillData);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Actualizar habilidad global (Admin)
export const updateGlobalSkill = async (skillId, skillData) => {
  try {
    const response = await apiClient.put(`/skills/${skillId}`, skillData);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Eliminar habilidad global (Admin)
export const deleteGlobalSkill = async (skillId) => {
  try {
    const response = await apiClient.delete(`/skills/${skillId}`);
    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Importar habilidades en lote (Admin)
export const bulkImportSkills = async (skillsData) => {
  try {
    const response = await apiClient.post(`/skills/bulk-import`, skillsData);
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

export const applyToOffer = async (data) => {
  try {
    return await apiClient.post(`/solicitudes`, data);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const getEnterprises = async () => {
  try {
    return await apiClient.get(`/enterprise/`);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const deleteEnterprise = async (id) => {
  try {
    return await apiClient.delete(`/enterprise/${id}`);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const updateEnterprise = async (id, data) => {
  try {
    return await apiClient.put(`/enterprise/${id}`, data);
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || "Error inesperado",
    };
  }
};

export const createEnterprise = async (data) => {
  try {
    const response = await apiClient.post("/enterprise/register", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.msg || error.message || "Error al crear la empresa",
    };
  }
};

// ##### Messages #####

// Enviar un nuevo mensaje
export const sendMessage = async (messageData) => {
  try {
    const res = await apiClient.post("/messages/send", messageData);
    return res.data;
  } catch (e) {
    console.error("Error sending message:", e);
    throw e;
  }
};

// Obtener todas las conversaciones del usuario
export const getConversations = async () => {
  try {
    const res = await apiClient.get("/messages/conversations");
    return res.data;
  } catch (e) {
    console.error("Error getting conversations:", e);
    throw e;
  }
};

// Obtener mensajes de una conversación específica
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const res = await apiClient.get(`/messages/conversation/${conversationId}?page=${page}&limit=${limit}`);
    return res.data;
  } catch (e) {
    console.error("Error getting messages:", e);
    throw e;
  }
};

// Marcar mensajes como leídos
export const markMessagesAsRead = async (conversationId) => {
  try {
    const res = await apiClient.put(`/messages/conversation/${conversationId}/read`);
    return res.data;
  } catch (e) {
    console.error("Error marking messages as read:", e);
    throw e;
  }
};

// Iniciar conversación con un candidato (solo para empresas)
export const startConversationWithCandidate = async (candidateId, jobOfferId, initialMessage) => {
  try {
    const res = await apiClient.post("/messages/start-conversation", {
      candidateId,
      jobOfferId,
      initialMessage
    });
    return res.data;
  } catch (e) {
    console.error("Error starting conversation:", e);
    throw e;
  }
};

