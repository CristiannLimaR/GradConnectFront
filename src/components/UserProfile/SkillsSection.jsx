import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";

export default function SkillsSection({
  habilidades,
  editHabilidades,
  setEditHabilidades,
  habilidadInput,
  setHabilidadInput,
  nivelInput,
  setNivelInput,
  addHabilidad,
  deleteHabilidad
}) {
  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Habilidades</h2>
        {/* Dialog para editar habilidades */}
        <Dialog open={editHabilidades} onOpenChange={setEditHabilidades}>
          <DialogTrigger asChild>
            <button
              onClick={() => setEditHabilidades(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              <Edit2 className="w-4 h-4" />Editar
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Editar habilidades</DialogTitle>
            <form onSubmit={addHabilidad} className="flex flex-col md:flex-row gap-2 mb-4 animate-fade-in">
              <div className="flex-1">
                <Label htmlFor="habilidadInput">Habilidad</Label>
                <Input id="habilidadInput" type="text" value={habilidadInput} onChange={e => setHabilidadInput(e.target.value)} placeholder="Agregar habilidad" />
              </div>
              <div className="flex-1">
                <Label htmlFor="nivelInput">Nivel</Label>
                <select
                  id="nivelInput"
                  value={nivelInput}
                  onChange={e => setNivelInput(e.target.value)}
                  className="border-input rounded-md border bg-background px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                >
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Agregar
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditHabilidades(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap gap-2 mb-4">
              {habilidades.map((hab, idx) => (
                <span
                  key={hab._id || idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {hab.nameSkill}
                  <span className="ml-2 text-xs text-gray-500">
                    {hab.levelSkill}
                  </span>
                  <button
                    type="button"
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => deleteHabilidad(idx)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {habilidades.map((hab, idx) => (
          <span
            key={hab._id || idx}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
          >
            {hab.nameSkill}
            <span className="ml-2 text-xs text-gray-500">
              {hab.levelSkill}
            </span>
          </span>
        ))}
        {habilidades.length === 0 && (
          <span className="text-gray-500">Sin habilidades registradas</span>
        )}
      </div>
    </section>
  );
}