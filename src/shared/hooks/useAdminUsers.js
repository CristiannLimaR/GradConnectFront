import { useState } from "react";
import { adminUpdateUser, adminDeleteUser } from "../../service/api";
import { toast } from "sonner";

export const useAdminUsers = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (id, formDataOrObj) => {
    setLoading(true);
    const resp = await adminUpdateUser(id, formDataOrObj);
    setLoading(false);

    if (resp.error) {
      const msg = resp.e.response?.data?.msg || "Error actualizando usuario";
      toast.error(msg);
      return null;
    }

    toast.success("Usuario actualizado");
    return resp.data.user;
  };

  const deleteUser = async (id) => {
    setLoading(true);
    const resp = await adminDeleteUser(id);
    setLoading(false);

    if (resp.error) {
      toast.error("Error eliminando usuario");
      return false;
    }

    toast.success("Usuario desactivado");
    return true;
  };

  return { loading, updateUser, deleteUser };
};
