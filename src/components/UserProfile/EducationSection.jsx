import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";

export default function EducationSection({ educacion, eduForm, editEduIdx, setEditEduIdx, setEduForm, addEducacion, deleteEducacion, handleEduChange }) {
  // Elimina openDialog y dialogMode
  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Educación</h2>
        {/* Dialog para agregar */}
        <Dialog open={editEduIdx === 'new'} onOpenChange={open => { setEditEduIdx(open ? 'new' : null); if (!open) setEduForm({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' }); }}>
          <DialogTrigger asChild>
            <button
              onClick={() => { setEditEduIdx('new'); setEduForm({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' }); }}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />Agregar
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Agregar educación</DialogTitle>
            <form onSubmit={addEducacion} className="bg-card border rounded-lg p-4 space-y-4 mb-6 animate-fade-in">
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" type="text" name="titulo" value={eduForm.titulo} onChange={handleEduChange} placeholder="Título" required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="institucion">Institución</Label>
                  <Input id="institucion" type="text" name="institucion" value={eduForm.institucion} onChange={handleEduChange} placeholder="Institución" required />
                </div>
              </div>
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex-1">
                  <Label htmlFor="desde">Desde</Label>
                  <Input id="desde" type="date" name="desde" value={eduForm.desde} onChange={handleEduChange} required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="hasta">Hasta</Label>
                  <Input id="hasta" type="date" name="hasta" value={eduForm.hasta} onChange={handleEduChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" value={eduForm.descripcion} onChange={handleEduChange} placeholder="Descripción" rows={2} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setEditEduIdx(null)}>Cancelar</Button>
                <Button type="submit" variant="default" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-4 mb-6">
        {educacion.map((edu, idx) => (
          <li key={idx} className="bg-gray-50 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border">
            <div>
              <div className="font-semibold text-gray-900">{edu.titulo} <span className="text-gray-500 font-normal">en {edu.institucion}</span></div>
              <div className="text-gray-500 text-sm">{edu.desde} - {edu.hasta}</div>
              <div className="text-gray-700 text-sm mt-1">{edu.descripcion}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {/* Dialog para editar */}
              <Dialog open={editEduIdx === idx} onOpenChange={open => { setEditEduIdx(open ? idx : null); if (!open) setEduForm({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' }); }}>
                <DialogTrigger asChild>
                  <button type="button" className="text-blue-600 hover:text-blue-800" onClick={() => { setEditEduIdx(idx); setEduForm(edu); }} title="Editar"><Edit2 className="w-4 h-4" /></button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Editar educación</DialogTitle>
                  <form onSubmit={addEducacion} className="bg-card border rounded-lg p-4 space-y-4 mb-6 animate-fade-in">
                    <div className="flex gap-2 flex-col md:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="titulo">Título</Label>
                        <Input id="titulo" type="text" name="titulo" value={eduForm.titulo} onChange={handleEduChange} placeholder="Título" required />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="institucion">Institución</Label>
                        <Input id="institucion" type="text" name="institucion" value={eduForm.institucion} onChange={handleEduChange} placeholder="Institución" required />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col md:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="desde">Desde</Label>
                        <Input id="desde" type="date" name="desde" value={eduForm.desde} onChange={handleEduChange} required />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="hasta">Hasta</Label>
                        <Input id="hasta" type="date" name="hasta" value={eduForm.hasta} onChange={handleEduChange} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea id="descripcion" name="descripcion" value={eduForm.descripcion} onChange={handleEduChange} placeholder="Descripción" rows={2} />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" onClick={() => setEditEduIdx(null)}>Cancelar</Button>
                      <Button type="submit" variant="default" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Actualizar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <button type="button" className="text-red-500 hover:text-red-700" onClick={() => deleteEducacion(idx)} title="Eliminar"><Trash2 className="w-4 h-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
} 