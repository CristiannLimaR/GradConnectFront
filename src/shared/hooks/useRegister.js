import { useState } from "react";
import { register as registerRequest, createEnterprise } from "../../service/api.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (userData, enterpriseData = null) => {
    setIsLoading(true);

    try {
      console.log("Datos recibidos en registerUser:", userData);
      // Registrar usuario primero
      const userResponse = await registerRequest(userData);
      
      if (userResponse.error) {
        let errorMsg = "Ocurrió un error durante el registro.";
        const backendMsg = userResponse.e?.response?.data?.msg;
        const backendError = userResponse.e?.response?.data?.error;
        const backendErrorsArray = userResponse.e?.response?.data?.errors;
        if (Array.isArray(backendErrorsArray) && backendErrorsArray.length > 0) {
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

      // Si es recruiter y hay datos de empresa, crear empresa
      if (userData.role === "RECRUITER" && enterpriseData) {
        // Crear FormData para la empresa si hay logo
        let enterpriseFormData;
        console.log("Verificando logo en enterpriseData:", enterpriseData.logo);
        if (enterpriseData.logo) {
          enterpriseFormData = new FormData();
          enterpriseFormData.append("name", enterpriseData.companyName);
          enterpriseFormData.append("description", enterpriseData.companyDescription);
          enterpriseFormData.append("logo", enterpriseData.logo);
          enterpriseFormData.append("webSite", enterpriseData.companyWebsite || "");
          enterpriseFormData.append("address", enterpriseData.companyAddress);
          enterpriseFormData.append("industry", enterpriseData.industry);
          enterpriseFormData.append("contactNumber", enterpriseData.companyContactNumber);
          enterpriseFormData.append("email", enterpriseData.companyEmail);
          enterpriseFormData.append("type", enterpriseData.companyType);
          enterpriseFormData.append("size", enterpriseData.companySize);
          enterpriseFormData.append("recruiters", userResponse.data.userDetails.id);
          console.log("FormData de empresa creado con campos:", Array.from(enterpriseFormData.entries()));
        } else {
          // Si no hay logo, enviar como JSON
          enterpriseFormData = {
            name: enterpriseData.companyName,
            description: enterpriseData.companyDescription,
            logo: "", // Campo requerido pero vacío
            webSite: enterpriseData.companyWebsite || "",
            address: enterpriseData.companyAddress,
            industry: enterpriseData.industry,
            contactNumber: enterpriseData.companyContactNumber,
            email: enterpriseData.companyEmail,
            type: enterpriseData.companyType,
            size: enterpriseData.companySize,
            recruiters: [userResponse.data.userDetails.id],
          };
        }

        const enterpriseResponse = await createEnterprise(enterpriseFormData);
        
        if (enterpriseResponse.error) {
          let errorMsg = "Usuario creado pero hubo un error al crear la empresa.";
          const backendMsg = enterpriseResponse.e?.response?.data?.msg;
          const backendError = enterpriseResponse.e?.response?.data?.error;
          if (typeof backendMsg === "string") {
            errorMsg = backendMsg;
          } else if (typeof backendError === "string") {
            errorMsg = backendError;
          }
          toast.error(errorMsg, {
            duration: 3000,
          });
          return;
        }

        toast.success("Registro exitoso", {
          description: "Usuario y empresa creados correctamente!",
          duration: 3000,
        });
      } else {
        toast.success("Registro exitoso", {
          description: "Usuario creado correctamente!",
          duration: 3000,
        });
      }

      navigate("/login");
    } catch (error) {
      console.error("Error en registro:", error);
      toast.error("Ocurrió un error durante el registro.", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
  };
};