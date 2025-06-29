import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ExperienceSection({ experiencia, expForm, editExpIdx, setEditExpIdx, setExpForm, addExperiencia, deleteExperiencia, handleExpChange }) {
  // Aquí puedes recibir la experiencia laboral por props o desde un hook de API
  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experiencia Laboral</h2>
        <button onClick={() => { setEditExpIdx('new'); setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '' }); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"><Plus className="w-4 h-4" />Agregar</button>
      </div>
      <ul className="space-y-4 mb-6">
        {experiencia.map((exp, idx) => (
          <li key={idx} className="bg-gray-50 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border">
            <div>
              <div className="font-semibold text-gray-900">{exp.puesto} <span className="text-gray-500 font-normal">en {exp.empresa}</span></div>
              <div className="text-gray-500 text-sm">{exp.desde} - {exp.hasta}</div>
              <div className="text-gray-700 text-sm mt-1">{exp.descripcion}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button type="button" className="text-blue-600 hover:text-blue-800" onClick={() => { setEditExpIdx(idx); setExpForm(exp); }} title="Editar"><Edit2 className="w-4 h-4" /></button>
              <button type="button" className="text-red-500 hover:text-red-700" onClick={() => deleteExperiencia(idx)} title="Eliminar"><Trash2 className="w-4 h-4" /></button>
            </div>
          </li>
        ))}
      </ul>
      {(editExpIdx !== null) && (
        <form onSubmit={addExperiencia} className="bg-white border rounded p-4 space-y-2 mb-6">
          <div className="flex gap-2 flex-col md:flex-row">
            <input type="text" name="puesto" value={expForm.puesto} onChange={handleExpChange} placeholder="Puesto" className="flex-1 border rounded px-3 py-2" required />
            <input type="text" name="empresa" value={expForm.empresa} onChange={handleExpChange} placeholder="Empresa" className="flex-1 border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <input type="text" name="desde" value={expForm.desde} onChange={handleExpChange} placeholder="Desde (año o fecha)" className="flex-1 border rounded px-3 py-2" required />
            <input type="text" name="hasta" value={expForm.hasta} onChange={handleExpChange} placeholder="Hasta (año o fecha o 'Actual')" className="flex-1 border rounded px-3 py-2" required />
          </div>
          <textarea name="descripcion" value={expForm.descripcion} onChange={handleExpChange} placeholder="Descripción" className="w-full border rounded px-3 py-2" rows={2} />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setEditExpIdx(null); setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '' }); }} className="text-gray-400 hover:text-gray-600 px-3 py-1">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">
              <Plus className="w-4 h-4" /> Guardar
            </button>
          </div>
        </form>
      )}
    </section>
  );
} 