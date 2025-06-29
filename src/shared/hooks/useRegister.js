import { useState } from "react";
import { register as registerRequest } from "../../service/api.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (data) => {
    setIsLoading(true);

    const response = await registerRequest(data);
    setIsLoading(false);
    console.log(response)
    if (response.error) {
      let errorMsg = "Ocurrió un error durante el registro.";
      const backendMsg = response.e?.response?.data?.msg;
      const backendError = response.e?.response?.data?.error;
      const backendErrorsArray = response.e?.response?.data?.errors;
      if (Array.isArray(backendErrorsArray) && backendErrorsArray.length > 0) {
        // Concatenar todos los mensajes de error
        errorMsg = backendErrorsArray.map(e => e.msg).join("\n");
      } else if (typeof backendMsg === "string") {
        errorMsg = backendMsg;
      } else if (typeof backendError === "string") {
        errorMsg = backendError;
      } else if (typeof backendMsg === "object") {
        errorMsg = JSON.stringify(backendMsg);
      } else if (typeof backendError === "object") {
        errorMsg = JSON.stringify(backendError);
      }
      toast.error(errorMsg, {
        duration: 3000,
      });
      return;
    }

    toast.success("Registration successful", {
      description: "You have registered successfully!",
      duration: 3000,
    });
    navigate("/login");
  };

  return {
    registerUser,
    isLoading,
  };
};