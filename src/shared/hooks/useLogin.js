import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../service/api.js";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const handleLogin = async (data) => {
    setLoading(true);

    const response = await loginRequest(data);

    if (response.error) {
      toast.error("Error de inicio de sesión", {
        description:
          response.error?.response?.data ||
          "Ocurrió un error durante el inicio de sesión.",
        duration: 2000,
      });
      setLoading(false);
      return { success: false, error: response.error?.response?.data };
    }

    const { token, user } = response.data;

    loginStore(user, token);
    console.log(user);

    setLoading(false);
    toast.success("¡Bienvenido de nuevo!", {
      duration: 3000,
    });
    navigate("/");

    return { success: true };
  };

  const handleLogout = () => {
    logoutStore();
    toast.success("Has cerrado sesión correctamente", {
      duration: 3000,
    });
    navigate("/login");
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    loading,
  };
};

export default useLogin;
