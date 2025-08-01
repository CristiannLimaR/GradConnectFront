import { useState } from "react";
import { 
  getUserSkills, 
  addUserSkill, 
  updateUserSkill, 
  deleteUserSkill, 
  searchGlobalSkills,
  getAllGlobalSkills,
  getSkillsByCategory,
  getGlobalSkillById,
  createGlobalSkill,
  updateGlobalSkill,
  deleteGlobalSkill,
  bulkImportSkills
} from "../../service/api";
import { toast } from "sonner";

export const useSkills = () => {
  const [loading, setLoading] = useState(false);

  // Obtener habilidades de un usuario
  const fetchUserSkills = async (userId) => {
    setLoading(true);
    try {
      const resp = await getUserSkills(userId);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error cargando habilidades del usuario";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando habilidades del usuario");
      return null;
    }
  };

  // Agregar habilidad a un usuario
  const addSkillToUser = async (userId, skillData) => {
    setLoading(true);
    try {
      const resp = await addUserSkill(skillData);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error agregando habilidad al usuario";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidad agregada al usuario");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado agregando habilidad al usuario");
      return null;
    }
  };

  // Actualizar habilidad de un usuario
  const updateUserSkillLevel = async (userId, skillId, skillData) => {
    setLoading(true);
    try {
      const resp = await updateUserSkill(userId, skillId, skillData);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error actualizando habilidad del usuario";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidad actualizada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado actualizando habilidad del usuario");
      return null;
    }
  };

  // Eliminar habilidad de un usuario
  const removeSkillFromUser = async (userId, skillId) => {
    setLoading(true);
    try {
      const resp = await deleteUserSkill(userId, skillId);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error eliminando habilidad del usuario";
        toast.error(msg);
        return false;
      }
      toast.success("Habilidad eliminada del usuario");
      return true;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado eliminando habilidad del usuario");
      return false;
    }
  };

  // Buscar habilidades globales
  const searchSkills = async (query, category = null) => {
    setLoading(true);
    try {
      const resp = await searchGlobalSkills(query, category);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error buscando habilidades";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado buscando habilidades");
      return null;
    }
  };

  // Obtener todas las habilidades globales
  const fetchAllGlobalSkills = async () => {
    setLoading(true);
    try {
      const resp = await getAllGlobalSkills();
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error cargando habilidades globales";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando habilidades globales");
      return null;
    }
  };

  // Obtener habilidades por categoría
  const fetchSkillsByCategory = async (category) => {
    setLoading(true);
    try {
      const resp = await getSkillsByCategory(category);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error cargando habilidades por categoría";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando habilidades por categoría");
      return null;
    }
  };

  // Obtener habilidad global por ID
  const fetchGlobalSkillById = async (skillId) => {
    setLoading(true);
    try {
      const resp = await getGlobalSkillById(skillId);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error obteniendo habilidad global";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado obteniendo habilidad global");
      return null;
    }
  };

  // Crear habilidad global (Admin)
  const createSkill = async (skillData) => {
    setLoading(true);
    try {
      const resp = await createGlobalSkill(skillData);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error creando habilidad global";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidad global creada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado creando habilidad global");
      return null;
    }
  };

  // Actualizar habilidad global (Admin)
  const updateSkill = async (skillId, skillData) => {
    setLoading(true);
    try {
      const resp = await updateGlobalSkill(skillId, skillData);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error actualizando habilidad global";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidad global actualizada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado actualizando habilidad global");
      return null;
    }
  };

  // Eliminar habilidad global (Admin)
  const removeSkill = async (skillId) => {
    setLoading(true);
    try {
      const resp = await deleteGlobalSkill(skillId);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error eliminando habilidad global";
        toast.error(msg);
        return false;
      }
      toast.success("Habilidad global eliminada");
      return true;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado eliminando habilidad global");
      return false;
    }
  };

  // Importar habilidades en lote (Admin)
  const importSkills = async (skillsData) => {
    setLoading(true);
    try {
      const resp = await bulkImportSkills(skillsData);
      setLoading(false);
      if (!resp.success) {
        const msg = resp.error?.response?.data?.msg || "Error importando habilidades";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidades importadas correctamente");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado importando habilidades");
      return null;
    }
  };

  return { 
    loading, 
    fetchUserSkills, 
    addSkillToUser, 
    updateUserSkillLevel, 
    removeSkillFromUser, 
    searchSkills,
    fetchAllGlobalSkills,
    fetchSkillsByCategory,
    fetchGlobalSkillById,
    createSkill,
    updateSkill,
    removeSkill,
    importSkills
  };
};
