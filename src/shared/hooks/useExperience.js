import { useState } from "react";
import { saveExperience, updateExperience, getExperience, deleteExperience } from "../../service/api";
import { toast } from "sonner";

export const useExperience = () => {
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchExperiences = async () => {
    if (hasLoaded) return experiences;
    
    setLoading(true);
    try {
      const resp = await getExperience();
      setLoading(false);
      
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error cargando experiencias";
        toast.error(msg);
        return null;
      }
      
      const fetchedExperiences = resp.data.experiences;
      setExperiences(fetchedExperiences);
      setHasLoaded(true);
      return fetchedExperiences;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado cargando experiencias");
      return null;
    }
  };

  const addExperience = async (experienceData) => {
    setLoading(true);
    try {
      const resp = await saveExperience(experienceData);
      setLoading(false);
      
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error guardando experiencia";
        toast.error(msg);
        return null;
      }
      
      // Actualizar el estado local con la nueva experiencia
      setExperiences(prev => [...prev, resp.data]);
      toast.success("Experiencia agregada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado guardando experiencia");
      return null;
    }
  };

  const updateExperienceById = async (experienceId, experienceData) => {
    setLoading(true);
    try {
      const resp = await updateExperience(experienceId, experienceData);
      setLoading(false);
      
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error actualizando experiencia";
        toast.error(msg);
        return null;
      }
      
      // Actualizar el estado local con la experiencia actualizada
      setExperiences(prev => 
        prev.map(exp => exp._id === experienceId ? resp.data : exp)
      );
      toast.success("Experiencia actualizada");
      return resp.data;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado actualizando experiencia");
      return null;
    }
  };

  const removeExperience = async (experienceId) => {
    setLoading(true);
    try {
      const resp = await deleteExperience(experienceId);
      setLoading(false);
      
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error eliminando experiencia";
        toast.error(msg);
        return false;
      }
      
      // Actualizar el estado local eliminando la experiencia
      setExperiences(prev => prev.filter(exp => exp._id !== experienceId));
      toast.success("Experiencia eliminada");
      return true;
    } catch (error) {
      setLoading(false);
      toast.error("Error inesperado eliminando experiencia");
      return false;
    }
  };

  const resetExperiences = () => {
    setExperiences([]);
    setHasLoaded(false);
  };

  return { 
    loading, 
    experiences,
    fetchExperiences, 
    addExperience, 
    updateExperienceById, 
    removeExperience,
    resetExperiences
  };
}; 