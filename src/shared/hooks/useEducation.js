import { useState, useCallback } from 'react';
import { saveEducation, getEducations, updateEducation, deleteEducation } from '../../service/api';

export const useEducation = () => {
  const [loading, setLoading] = useState(false);
  const [educations, setEducations] = useState([]);
  const [error, setError] = useState(null);

  const fetchEducations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEducations();
      if (result.success) {
        setEducations(result.data.educations || []);
      } else {
        setError('Error al cargar la educación');
        console.error('Error fetching educations:', result.error);
      }
    } catch (err) {
      setError('Error al cargar la educación');
      console.error('Error fetching educations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEducation = useCallback(async (educationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await saveEducation(educationData);
      if (result.success) {
        setEducations(prev => [...prev, result.data.education]);
        return true;
      } else {
        setError('Error al crear la educación');
        console.error('Error creating education:', result.error);
        return false;
      }
    } catch (err) {
      setError('Error al crear la educación');
      console.error('Error creating education:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEducationById = useCallback(async (educationId, educationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateEducation(educationId, educationData);
      if (result.success) {
        setEducations(prev => 
          prev.map(edu => 
            edu._id === educationId ? result.data.education : edu
          )
        );
        return true;
      } else {
        setError('Error al actualizar la educación');
        console.error('Error updating education:', result.error);
        return false;
      }
    } catch (err) {
      setError('Error al actualizar la educación');
      console.error('Error updating education:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeEducation = useCallback(async (educationId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteEducation(educationId);
      if (result.success) {
        setEducations(prev => prev.filter(edu => edu._id !== educationId));
        return true;
      } else {
        setError('Error al eliminar la educación');
        console.error('Error deleting education:', result.error);
        return false;
      }
    } catch (err) {
      setError('Error al eliminar la educación');
      console.error('Error deleting education:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    educations,
    error,
    fetchEducations,
    addEducation,
    updateEducationById,
    removeEducation
  };
};
