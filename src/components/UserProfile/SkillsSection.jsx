import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import SkillSelector from '../SkillSelector';
import { useSkills } from '../../shared/hooks/useSkills';
import useAuthStore from '../../shared/stores/authStore';
import { getGlobalSkillById } from '../../service/api';

export default function SkillsSection() {
  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.updateUser);
  
  const [editHabilidades, setEditHabilidades] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { fetchUserSkills, loading: skillsLoading } = useSkills();
  // Cargar habilidades del usuario
  useEffect(() => {
    const loadUserSkills = async () => {
      if (user?.id) {
        setLoading(true);
        const skills = await fetchUserSkills();
        if (skills) {
          console.log('Skills loaded:', skills); // Debug log
          
          // Procesar skills para manejar las que no están populadas
          const processedSkills = await Promise.all(
            skills.map(async (skill) => {
              // Si skillId es solo un string (no populado), cargar los detalles
              if (typeof skill.skillId === 'string') {
                try {
                  const skillDetails = await getGlobalSkillById(skill.skillId);
                  if (skillDetails.success) {
                    return {
                      ...skill,
                      skillId: skillDetails.data
                    };
                  }
                } catch (error) {
                  console.error('Error loading skill details:', error);
                }
              }
              return skill;
            })
          );
          
          console.log('Processed skills:', processedSkills); // Debug log
          setUserSkills(processedSkills);
          // Actualizar el usuario en el store con las habilidades
          setAuthUser({ ...user, skills: processedSkills });
        }
        setLoading(false);
      }
    };

    loadUserSkills();
  }, [user?.id]);

  const handleSkillAdded = (newSkill) => {
    setUserSkills(prev => [...prev, newSkill]);
      // Actualizar el usuario en el store
    setAuthUser({ ...user, skills: [...userSkills, newSkill] });
  };

  const handleSkillRemoved = (removedSkill) => {
    setUserSkills(prev => prev.filter(skill => skill._id !== removedSkill._id));
    // Actualizar el usuario en el store
    setAuthUser({ 
      ...user, 
      skills: userSkills.filter(skill => skill._id !== removedSkill._id) 
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'Principiante';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      default:
        return level;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'TECHNICAL':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHITECTURE':
        return 'bg-purple-100 text-purple-800';
      case 'FINANCE':
        return 'bg-green-100 text-green-800';
      case 'SALES':
        return 'bg-orange-100 text-orange-800';
      case 'HEALTH':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Habilidades</h2>
        
        {/* Dialog para editar habilidades */}
        <Dialog open={editHabilidades} onOpenChange={setEditHabilidades}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditHabilidades(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Editar Habilidades
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogTitle>Gestionar Habilidades</DialogTitle>
            
            <SkillSelector
              userId={user?.id}
              selectedSkills={userSkills}
              onSkillAdded={handleSkillAdded}
              onSkillRemoved={handleSkillRemoved}
              className="mt-4"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Vista de habilidades */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando habilidades...</span>
        </div>
      ) : userSkills.length > 0 ? (
        <div className="space-y-3">
          {userSkills.map((userSkill) => (
            <Card key={userSkill._id} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {userSkill.skillId?.nameSkill || `Skill ID: ${userSkill.skillId}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Agregada el {new Date(userSkill.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {userSkill.skillId?.category && (
                      <Badge className={getCategoryColor(userSkill.skillId.category)}>
                        {userSkill.skillId.category}
                      </Badge>
                    )}
                    <Badge className={getLevelColor(userSkill.levelSkill)}>
                      {getLevelText(userSkill.levelSkill)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No tienes habilidades agregadas</p>
          <p className="text-sm">Haz clic en "Editar Habilidades" para agregar tus habilidades técnicas</p>
        </div>
      )}

      {/* Resumen de habilidades */}
      {userSkills.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-gray-600">
              Total: {userSkills.length} habilidad{userSkills.length !== 1 ? 'es' : ''}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">
              Principiante: {userSkills.filter(s => s.levelSkill === 'BEGINNER').length}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">
              Intermedio: {userSkills.filter(s => s.levelSkill === 'INTERMEDIATE').length}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">
              Avanzado: {userSkills.filter(s => s.levelSkill === 'ADVANCED').length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}