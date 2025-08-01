import { useState } from "react";
import { saveSkills, getSkills, deleteSkill, getAllSkills as getAllSkillsReq, getSkillById as getSkillByIdReq } from "../../service/api";
import { toast } from "sonner";

export const useSkills = () => {
  const [loading, setLoading] = useState(false);

  const fetchSkills = async (userId) => {
    setLoading(true);
    try {
      const resp = await getSkills(userId);
      setLoading(false);
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error cargando habilidades";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando habilidades");
      return null;
    }
  };

  const getSkillById = async (skillId) => {
    setLoading(true);
    try {
      const resp = await getSkillByIdReq(skillId);
      setLoading(false);

      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error obteniendo habilidad";
        toast.error(msg);
        return null;
      }

      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado obteniendo habilidad");
      return null;
    }
  }

  const addSkill = async (skillData) => {
    console.log(skillData);
    setLoading(true);
    try {
      const resp = await saveSkills(skillData);
      setLoading(false);
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error guardando habilidad";
        toast.error(msg);
        return null;
      }
      toast.success("Habilidad agregada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado guardando habilidad");
      return null;
    }
  };

  const removeSkill = async (skillId) => {
    setLoading(true);
    try {
      const resp = await deleteSkill(skillId);
      setLoading(false);
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error eliminando habilidad";
        toast.error(msg);
        return false;
      }
      toast.success("Habilidad eliminada");
      return true;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado eliminando habilidad");
      return false;
    }
  };

  const getAllSkills = async (params) => {
    setLoading(true);
    try {
      const resp = await getAllSkillsReq()
      setLoading(false);
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error cargando habilidades";
        toast.error(msg);
        return null;
      }
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando habilidades");
      return false;
    }
  };

  return { loading, fetchSkills, addSkill, removeSkill, getAllSkills, getSkillById };
};
