import { getEnterpriseByRecruiter as getEnterpriseByRecruiterService } from "../../service/api";

import { useState } from "react";
import { toast } from "sonner";

export const useEnterprise = () => {
  const [enterprise, setEnterprise] = useState([]);

  // Listar empresa-reclutador
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

  return {
    getEnterpriseByRecruiter,
    enterprise,
  };
};
