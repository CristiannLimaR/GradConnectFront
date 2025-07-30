import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";

export default function ExperienceSection({
  experiencia,
  expForm,
  editExpIdx,
  setEditExpIdx,
  setExpForm,
  addExperiencia,
  deleteExperiencia,
  handleExpChange
}) {
  // Elimina openDialog y dialogMode

  const handleCancelForm = () => {
    setEditExpIdx(null);
    setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false });
  };

  const handleAddClick = () => {
    setEditExpIdx('new');
    setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false });
    // setDialogMode("add"); // This line is removed
    // setOpenDialog(true); // This line is removed
  };

  const handleEditClick = (expToEdit, idx) => {
    setExpForm({
      puesto: expToEdit.title || '',
      empresa: expToEdit.company || '',
      desde: expToEdit.startDate ? new Date(expToEdit.startDate).toISOString().split('T')[0] : '',
      hasta: expToEdit.endDate ? new Date(expToEdit.endDate).toISOString().split('T')[0] : '',
      descripcion: expToEdit.description || '',
      isCurrent: expToEdit.isCurrent || false,
      _id: expToEdit._id || expToEdit.id || null
    });

    setEditExpIdx(idx);
    // setDialogMode("edit"); // This line is removed
    // setOpenDialog(true); // This line is removed
  };

  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experiencia Laboral</h2>
        {/* Dialog para agregar */}
        <Dialog open={editExpIdx === 'new'} onOpenChange={open => { setEditExpIdx(open ? 'new' : null); if (!open) setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false }); }}>
          <DialogTrigger asChild>
            <button
              onClick={() => { setEditExpIdx('new'); setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false }); }}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />Agregar
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Agregar experiencia</DialogTitle>
            <form onSubmit={addExperiencia} className="bg-card border rounded-lg p-4 space-y-4 mb-6 animate-fade-in">
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="puesto">Puesto</Label>
                  <Input id="puesto" type="text" name="puesto" value={expForm.puesto} onChange={handleExpChange} placeholder="Puesto" required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" type="text" name="empresa" value={expForm.empresa} onChange={handleExpChange} placeholder="Empresa" required />
                </div>
              </div>
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="desde">Desde</Label>
                  <Input id="desde" type="date" name="desde" value={expForm.desde} onChange={handleExpChange} required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="hasta">Hasta</Label>
                  <Input id="hasta" type="date" name="hasta" value={expForm.hasta} onChange={handleExpChange} disabled={expForm.isCurrent} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input id="isCurrent" type="checkbox" name="isCurrent" checked={expForm.isCurrent} onChange={handleExpChange} className="w-4 h-4" />
                <Label htmlFor="isCurrent" className="block text-sm">Actualmente trabajo aquí</Label>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" value={expForm.descripcion} onChange={handleExpChange} placeholder="Descripción" rows={2} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setEditExpIdx(null)}>Cancelar</Button>
                <Button type="submit" variant="default" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-4 mb-6">
        {experiencia.length === 0 && editExpIdx === null && (
          <p className="text-gray-600">Sin experiencia registrada.</p>
        )}
        {experiencia.map((exp, idx) => (
          <li key={exp._id || exp.id || idx} className="bg-gray-50 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border">
            <div>
              <div className="font-semibold text-gray-900">{exp.title} <span className="text-gray-500 font-normal">en {exp.company}</span></div>
              <div className="text-gray-500 text-sm">
                {exp.startDate ? new Date(exp.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : ''} -{' '}
                {exp.isCurrent ? 'Actual' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A')}
              </div>
              <div className="text-gray-700 text-sm mt-1">{exp.description}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {/* Dialog para editar */}
              <Dialog open={editExpIdx === idx} onOpenChange={open => { setEditExpIdx(open ? idx : null); if (!open) setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false }); }}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => { setEditExpIdx(idx); setExpForm({
                      puesto: exp.title || '',
                      empresa: exp.company || '',
                      desde: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                      hasta: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                      descripcion: exp.description || '',
                      isCurrent: exp.isCurrent || false,
                      _id: exp._id || exp.id || null
                    }); }}
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Editar experiencia</DialogTitle>
                  <form onSubmit={addExperiencia} className="bg-card border rounded-lg p-4 space-y-4 mb-6 animate-fade-in">
                    <div className="flex gap-2 flex-col md:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="puesto">Puesto</Label>
                        <Input id="puesto" type="text" name="puesto" value={expForm.puesto} onChange={handleExpChange} placeholder="Puesto" required />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input id="empresa" type="text" name="empresa" value={expForm.empresa} onChange={handleExpChange} placeholder="Empresa" required />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col md:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="desde">Desde</Label>
                        <Input id="desde" type="date" name="desde" value={expForm.desde} onChange={handleExpChange} required />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="hasta">Hasta</Label>
                        <Input id="hasta" type="date" name="hasta" value={expForm.hasta} onChange={handleExpChange} disabled={expForm.isCurrent} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="isCurrent" type="checkbox" name="isCurrent" checked={expForm.isCurrent} onChange={handleExpChange} className="w-4 h-4" />
                      <Label htmlFor="isCurrent" className="block text-sm">Actualmente trabajo aquí</Label>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea id="descripcion" name="descripcion" value={expForm.descripcion} onChange={handleExpChange} placeholder="Descripción" rows={2} />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" onClick={() => setEditExpIdx(null)}>Cancelar</Button>
                      <Button type="submit" variant="default" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Actualizar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  const experienceId = exp._id || exp.id;
                  if (experienceId) {
                    deleteExperiencia(experienceId);
                  }
                }}
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
