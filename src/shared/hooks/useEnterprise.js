import {
  getEnterpriseByRecruiter as getEnterpriseByRecruiterService,
  getEnterprises as getEnterpriseService,
  deleteEnterprise as deleteEnterpriseService,
  updateEnterprise as updateEnterpriseService,
} from "../../service/api";

import { useState } from "react";
import { toast } from "sonner";

export const useEnterprise = () => {
  const [enterprise, setEnterprise] = useState([]);

  const getEnterpriseByRecruiter = async (id) => {
    const response = await getEnterpriseByRecruiterService(id);

    if (response.error) {
      toast.error("Error al obtener wOffers", {
        description:
          response.error?.response?.data || "Error al obtener wOffers",
        duration: 2000,
      });
      return { error: true };
    }

    setEnterprise(response?.data?.enterprise || []);
    return response.data;
  };

  const getEnterprises = async () => {
    try {
      const response = await getEnterpriseService();
      if (response.error) {
        toast.error("Error al obtener empresas", {
          description:
            response.error?.response?.data || "Error al obtener empresas",
          duration: 2000,
        });
        return { error: true };
      }
      setEnterprise(response.data);
      return response.data;
    } catch (error) {
      toast.error("Error al obtener empresas", {
        description: error?.response?.data || "Error al obtener empresas",
        duration: 2000,
      });
      return { error: true };
    }
  };

  const deleteEnterprise = async (id) => {
    try {
      const response = await deleteEnterpriseService(id);

      if (response.error) {
        toast.error("Error al eliminar la empresa", {
          description:
            response.error?.response?.data || "Error al eliminar la empresa",
          duration: 2000,
        });
        return { error: true };
      }
      toast.success("Empresa eliminada correctamente");
      await getEnterprises();
      return response.data;
    } catch (error) {
      toast.error("Error al eliminar la empresa", {
        description: error?.response?.data || "Error al eliminar la empresa",
        duration: 2000,
      });
      return { error: true };
    }
  };

  const updateEnterprise = async (id, data) => {
    try {
      const response = await updateEnterpriseService(id, data);

      if (response.error) {
        toast.error("Error al actualizar la empresa", {
          description:
            response.error?.response?.data || "Error al actualizar la empresa",
          duration: 2000,
        });
        return { error: true };
      }
      toast.success("Empresa actualizada correctamente");
      return response.data;
    } catch (error) {
      toast.error("Error al actualizar la empresa", {
        description: error?.response?.data || "Error al actualizar la empresa",
        duration: 2000,
      });
      return { error: true };
    }
  }

  return {
    getEnterpriseByRecruiter,
    getEnterprises,
    deleteEnterprise,
    updateEnterprise,
    enterprise,
  };
};
