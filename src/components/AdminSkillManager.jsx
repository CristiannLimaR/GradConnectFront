import React, { useState, useEffect } from 'react';
import { useSkills } from '../shared/hooks/useSkills';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { Plus, Edit2, Trash2, Search, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

const AdminSkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [importData, setImportData] = useState('');
  
  const [formData, setFormData] = useState({
    nameSkill: '',
    levelSkill: 'BEGINNER',
    category: 'TECHNICAL'
  });

  const { 
    fetchAllGlobalSkills, 
    createSkill, 
    updateSkill, 
    removeSkill, 
    importSkills,
    loading 
  } = useSkills();

  // Cargar habilidades globales
  useEffect(() => {
    loadSkills();
  }, []);

  // Filtrar habilidades
  useEffect(() => {
    let filtered = skills;
    
    if (searchQuery) {
      filtered = filtered.filter(skill => 
        skill.nameSkill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }
    
    setFilteredSkills(filtered);
  }, [skills, searchQuery, selectedCategory]);

  const loadSkills = async () => {
    const skillsData = await fetchAllGlobalSkills();
    if (skillsData) {
      setSkills(skillsData);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!formData.nameSkill.trim()) {
      toast.error('El nombre de la habilidad es requerido');
      return;
    }

    const result = await createSkill(formData);
    if (result) {
      setSkills(prev => [...prev, result]);
      setFormData({ nameSkill: '', levelSkill: 'BEGINNER', category: 'TECHNICAL' });
      setShowAddDialog(false);
      toast.success('Habilidad creada exitosamente');
    }
  };

  const handleEditSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill || !formData.nameSkill.trim()) {
      toast.error('El nombre de la habilidad es requerido');
      return;
    }

    const result = await updateSkill(editingSkill._id, formData);
    if (result) {
      setSkills(prev => prev.map(skill => 
        skill._id === editingSkill._id ? result : skill
      ));
      setEditingSkill(null);
      setFormData({ nameSkill: '', levelSkill: 'BEGINNER', category: 'TECHNICAL' });
      setShowEditDialog(false);
      toast.success('Habilidad actualizada exitosamente');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
      const success = await removeSkill(skillId);
      if (success) {
        setSkills(prev => prev.filter(skill => skill._id !== skillId));
        toast.success('Habilidad eliminada exitosamente');
      }
    }
  };

  const handleImportSkills = async () => {
    try {
      const skillsArray = JSON.parse(importData);
      if (!Array.isArray(skillsArray)) {
        toast.error('El formato debe ser un array de habilidades');
        return;
      }

      const result = await importSkills({ skills: skillsArray });
      if (result) {
        await loadSkills(); // Recargar habilidades
        setImportData('');
        setShowImportDialog(false);
        toast.success(`${result.inserted} habilidades importadas exitosamente`);
      }
    } catch (error) {
      toast.error('Error al parsear el JSON. Verifica el formato.');
    }
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setFormData({
      nameSkill: skill.nameSkill,
      levelSkill: skill.levelSkill,
      category: skill.category
    });
    setShowEditDialog(true);
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

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'TECHNICAL', label: 'Técnicas' },
    { value: 'ARCHITECTURE', label: 'Arquitectura' },
    { value: 'FINANCE', label: 'Finanzas' },
    { value: 'SALES', label: 'Ventas' },
    { value: 'HEALTH', label: 'Salud' },
    { value: 'OTHER', label: 'Otras' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Habilidades Globales</h1>
          <p className="text-gray-600">Administra las habilidades disponibles en el sistema</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Habilidad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Agregar Nueva Habilidad</DialogTitle>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre de la Habilidad</label>
                  <Input
                    value={formData.nameSkill}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameSkill: e.target.value }))}
                    placeholder="Ej: JavaScript"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nivel</label>
                    <select
                      value={formData.levelSkill}
                      onChange={(e) => setFormData(prev => ({ ...prev, levelSkill: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="BEGINNER">Principiante</option>
                      <option value="INTERMEDIATE">Intermedio</option>
                      <option value="ADVANCED">Avanzado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="TECHNICAL">Técnicas</option>
                      <option value="ARCHITECTURE">Arquitectura</option>
                      <option value="FINANCE">Finanzas</option>
                      <option value="SALES">Ventas</option>
                      <option value="HEALTH">Salud</option>
                      <option value="OTHER">Otras</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Habilidad'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogTitle>Importar Habilidades</DialogTitle>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">JSON de Habilidades</label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder='[{"nameSkill": "JavaScript", "levelSkill": "BEGINNER", "category": "TECHNICAL"}]'
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleImportSkills} disabled={loading}>
                    {loading ? 'Importando...' : 'Importar'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar habilidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de habilidades */}
      <div className="grid gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{skill.nameSkill}</h3>
                    <p className="text-sm text-gray-500">
                      Creada el {new Date(skill.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(skill.category)}>
                    {skill.category}
                  </Badge>
                  <Badge className={getLevelColor(skill.levelSkill)}>
                    {getLevelText(skill.levelSkill)}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(skill)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron habilidades</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {skills.filter(s => s.levelSkill === 'BEGINNER').length}
              </div>
              <div className="text-sm text-gray-600">Principiantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {skills.filter(s => s.levelSkill === 'INTERMEDIATE').length}
              </div>
              <div className="text-sm text-gray-600">Intermedios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {skills.filter(s => s.levelSkill === 'ADVANCED').length}
              </div>
              <div className="text-sm text-gray-600">Avanzados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogTitle>Editar Habilidad</DialogTitle>
          <form onSubmit={handleEditSkill} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre de la Habilidad</label>
              <Input
                value={formData.nameSkill}
                onChange={(e) => setFormData(prev => ({ ...prev, nameSkill: e.target.value }))}
                placeholder="Ej: JavaScript"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nivel</label>
                <select
                  value={formData.levelSkill}
                  onChange={(e) => setFormData(prev => ({ ...prev, levelSkill: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="TECHNICAL">Técnicas</option>
                  <option value="ARCHITECTURE">Arquitectura</option>
                  <option value="FINANCE">Finanzas</option>
                  <option value="SALES">Ventas</option>
                  <option value="HEALTH">Salud</option>
                  <option value="OTHER">Otras</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSkillManager; 