import { useState } from "react";
import { updateProfile, changePassword } from "../../service/api";
import useAuthStore from "../stores/authStore";
import { toast } from "sonner";

export const useProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const updateUserStore = useAuthStore((state) => state.updateUser);
  const userId = useAuthStore.getState().user?._id;

  const saveProfile = async (formData) => {
    setIsSaving(true);
    const resp = await updateProfile(formData);
    setIsSaving(false);

    if (resp.error) {
      const msg = resp.e.response?.data?.msg || "Error al actualizar perfil";
      toast.error(msg);
      return false;
    }

    const { user } = resp.data;
    updateUserStore(user);
    toast.success("Perfil actualizado");
    return true;
  };

  const savePassword = async ({ passwordConfirm, newPassword }) => {
    if (!userId) {
      toast.error("Usuario no autenticado");
      return false;
    }

    setIsSaving(true);
    const resp = await changePassword(userId, { passwordConfirm, newPassword });
    setIsSaving(false);

    if (resp.error) {
      const msg = resp.e.response?.data?.msg || "Error al cambiar contraseña";
      toast.error(msg);
      return false;
    }

    toast.success("Contraseña actualizada");
    return true;
  };

  return { isSaving, saveProfile, savePassword };
};
