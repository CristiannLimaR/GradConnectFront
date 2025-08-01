import React, { useState, useEffect, useRef } from 'react';
import { useSkills } from '../shared/hooks/useSkills';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Search, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const JobSkillSelector = ({ 
  selectedSkills = [], 
  onSkillAdded,
  onSkillRemoved,
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { searchSkills, loading } = useSkills();
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
            !selectedSkills.some(selected => selected._id === skill._id)
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

  const handleSkillSelect = (skill) => {
    try {
      onSkillAdded(skill);
      setSearchQuery('');
      setShowDropdown(false);
      setSearchResults([]);
      toast.success(`Habilidad "${skill.nameSkill}" agregada`);
    } catch (error) {
      toast.error('Error al agregar la habilidad');
    }
  };

  const handleSkillRemove = (skill) => {
    try {
      onSkillRemoved(skill);
      toast.success(`Habilidad "${skill.nameSkill}" eliminada`);
    } catch (error) {
      toast.error('Error al eliminar la habilidad');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de habilidades */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Habilidades requeridas
        </label>
        
        <div className="relative">
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
            Habilidades seleccionadas ({selectedSkills.length})
          </label>
          
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill.nameSkill}</span>
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSkills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No hay habilidades seleccionadas</p>
          <p className="text-sm">Busca y agrega las habilidades requeridas para este puesto</p>
        </div>
      )}
    </div>
  );
};

export default JobSkillSelector;
