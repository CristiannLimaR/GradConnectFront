import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

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
        <button
          onClick={() => setEditHabilidades(true)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />Editar
        </button>
      </div>
      {!editHabilidades ? (
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
      ) : (
        <form onSubmit={addHabilidad} className="flex gap-2 mb-4">
          <input
            type="text"
            value={habilidadInput}
            onChange={e => setHabilidadInput(e.target.value)}
            placeholder="Agregar habilidad"
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={nivelInput}
            onChange={e => setNivelInput(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="ADVANCED">Avanzado</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
          <button
            type="button"
            onClick={() => setEditHabilidades(false)}
            className="text-gray-400 hover:text-gray-600 px-3 py-2"
          >
            Cancelar
          </button>
        </form>
      )}
      {editHabilidades && (
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
      )}
    </section>
  );
}