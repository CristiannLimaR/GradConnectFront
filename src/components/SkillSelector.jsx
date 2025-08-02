import React, { useState, useEffect, useRef } from 'react';
import { useSkills } from '../shared/hooks/useSkills';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Search, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SkillSelector = ({ 
  userId, 
  onSkillAdded, 
  onSkillRemoved, 
  selectedSkills = [], 
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('BEGINNER');
  const [isLoading, setIsLoading] = useState(false);
  
  const { searchSkills, addSkillToUser, removeSkillFromUser, loading } = useSkills();
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar habilidades con debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        const results = await searchSkills(searchQuery.trim());
        setIsLoading(false);
        
        if (results) {
          // Filtrar habilidades que ya están seleccionadas
          const filteredResults = results.filter(skill => 
            !selectedSkills.some(selected => selected.skillId._id === skill._id)
          );
          setSearchResults(filteredResults);
          setShowDropdown(true);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedSkills]);

  const handleSkillSelect = async (skill) => {
    try {
      const skillData = {
        skillId: skill._id,
        levelSkill: selectedLevel
      };

      const result = await addSkillToUser(userId, skillData);
      
      if (result) {
        onSkillAdded(result);
        setSearchQuery('');
        setShowDropdown(false);
        setSearchResults([]);
        toast.success(`Habilidad "${skill.nameSkill}" agregada`);
      }
    } catch (error) {
      toast.error('Error al agregar la habilidad');
    }
  };

  const handleSkillRemove = async (skill) => {
    try {
      console.log('Skill object to remove:', skill);
      console.log('Skill._id:', skill._id);
      console.log('UserId:', userId);
      
      const success = await removeSkillFromUser(userId, skill._id);
      
      if (success) {
        onSkillRemoved(skill);
        toast.success(`Habilidad "${skill.skillId.nameSkill}" eliminada`);
      }
    } catch (error) {
      toast.error('Error al eliminar la habilidad');
    }
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de habilidades */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Agregar Habilidades
        </label>
        
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar habilidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>

          {/* Dropdown de resultados */}
          {showDropdown && searchResults.length > 0 && (
            <div 
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Buscando habilidades...
                </div>
              ) : (
                searchResults.map((skill) => (
                  <button
                    key={skill._id}
                    onClick={() => handleSkillSelect(skill)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.nameSkill}</span>
                      <Badge variant="secondary" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      Nivel por defecto: {getLevelText(skill.levelSkill)}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {showDropdown && searchResults.length === 0 && searchQuery.trim().length >= 2 && !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
              No se encontraron habilidades
            </div>
          )}
        </div>
      </div>

      {/* Habilidades seleccionadas */}
      {selectedSkills.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Habilidades ({selectedSkills.length})
          </label>
          
          <div className="space-y-2">
            {selectedSkills.map((userSkill) => (
              <Card key={userSkill._id} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">
                          {userSkill.skillId.nameSkill}
                        </div>
                        <div className="text-sm text-gray-500">
                          Categoría: {userSkill.skillId.category}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(userSkill.levelSkill)}>
                        {getLevelText(userSkill.levelSkill)}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkillRemove(userSkill)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedSkills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No tienes habilidades agregadas</p>
          <p className="text-sm">Busca y agrega tus habilidades técnicas</p>
        </div>
      )}
    </div>
  );
};

export default SkillSelector; 