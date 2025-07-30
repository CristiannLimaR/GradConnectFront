import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

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
  const handleCancelForm = () => {
    setEditExpIdx(null);
    setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false });
  };

  const handleAddClick = () => {
    setEditExpIdx('new');
    setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '', isCurrent: false });
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
  };

  return (
    <section className="w-full py-0 border-t-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experiencia Laboral</h2>
        <button
          onClick={handleAddClick}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />Agregar
        </button>
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
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleEditClick(exp, idx)}
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
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

      {editExpIdx !== null && (
        <form onSubmit={addExperiencia} className="bg-white border rounded p-4 space-y-2 mb-6">
          <div className="flex gap-2 flex-col md:flex-row">
            <input type="text" name="puesto" value={expForm.puesto} onChange={handleExpChange} placeholder="Puesto" className="flex-1 border rounded px-3 py-2" required />
            <input type="text" name="empresa" value={expForm.empresa} onChange={handleExpChange} placeholder="Empresa" className="flex-1 border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <input type="date" name="desde" value={expForm.desde} onChange={handleExpChange} className="flex-1 border rounded px-3 py-2" required />
            <input
              type="date"
              name="hasta"
              value={expForm.hasta}
              onChange={handleExpChange}
              className="flex-1 border rounded px-3 py-2"
              disabled={expForm.isCurrent}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCurrent"
              name="isCurrent"
              checked={expForm.isCurrent}
              onChange={handleExpChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900">
              Actualmente trabajo aquí
            </label>
          </div>
          <textarea name="descripcion" value={expForm.descripcion} onChange={handleExpChange} placeholder="Descripción" className="w-full border rounded px-3 py-2" rows={2} />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelForm}
              className="text-gray-400 hover:text-gray-600 px-3 py-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
            >
              <Plus className="w-4 h-4" /> {editExpIdx !== 'new' ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
