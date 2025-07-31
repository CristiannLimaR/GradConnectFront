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
      window.location.href = "/login";
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
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

// ##### wOffers #####
export const getWOffers = async (data) => {
  try {
    return await apiClient.get(`/wOffer/`, data);
  } catch (error) {
    return {
      error: true,
      error,
    };
  }
};

export const searchWOffer = async (id) => {
  try {
    return await apiClient.get(`/wOffer/search/${id}`)
  } catch (error) {
    return {
      error: true,
      error,
    };
  }
};

export const saveWOffer = async (formData) => {
  try {
    return await apiClient.post(`/wOffer/save`, formData)
  } catch (error) {
    return {
      error: true,
      error,
    };
  }
}

export const editWOffer = async (id, data) => {
  try {
    return await apiClient.put(`/wOffer/update/${id}`,data)
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}

export const deleteWOffer = async (id) => {
  try {
    return await apiClient.delete(`/wOffer/delete/${id}`)
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}

export const getOffersByEnterprise = async (enterpriseId) => {
  try {
    return await apiClient.get(`/wOffer/search/woffers/enterprise/${enterpriseId}`);
  } catch (error) {
    return {
      error: true,
      error,
    };
  }
}

// ##### Enterprise #####
export const getEnterpriseByRecruiter = async (recruiterId) => {
  try {
    return await apiClient.get(`/enterprise/recruiter/${recruiterId}`);
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}

export const getEnterprises = async () => {
  try {
    return await apiClient.get(`/enterprise/`);
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}

export const deleteEnterprise = async (id) => {
  try {
    return await apiClient.delete(`/enterprise/${id}`);
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}

export const updateEnterprise = async (id, data) => {
  try {
    console.log("Updating enterprise with data:", data);
    return await apiClient.put(`/enterprise/${id}`, data);
  } catch (error) {
    return {
      error: true,
      error
    }
  }
}