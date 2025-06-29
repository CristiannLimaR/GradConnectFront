import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { jobColumns } from './columns/job-columns';

export default function JobManagement() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Desarrollador Frontend Senior',
      description: 'Buscamos un desarrollador frontend con experiencia en React, TypeScript y diseño de interfaces de usuario modernas',
      company: 'TechCorp Solutions',
      salary: 45000,
      location: 'Remoto',
      modality: 'Tiempo Completo',
      ubication: 'Madrid, España',
      applications: [
        { id: 1, firstName: 'Juan', lastName: 'Pérez' },
        { id: 2, firstName: 'María', lastName: 'García' }
      ],
      closingDate: '2024-03-15',
      status: true
    },
    {
      id: 2,
      title: 'Desarrollador Backend',
      description: 'Desarrollador backend especializado en Node.js, MongoDB y arquitecturas de microservicios',
      company: 'InnovateLab',
      salary: 40000,
      location: 'Presencial',
      modality: 'Tiempo Completo',
      ubication: 'Barcelona, España',
      applications: [
        { id: 3, firstName: 'Carlos', lastName: 'López' }
      ],
      closingDate: '2024-03-10',
      status: true
    },
    {
      id: 3,
      title: 'Data Scientist',
      description: 'Científico de datos con experiencia en Python, machine learning y análisis de datos empresariales',
      company: 'DataCorp International',
      salary: 55000,
      location: 'Hibrido',
      modality: 'Tiempo Completo',
      ubication: 'Valencia, España',
      applications: [],
      closingDate: '2024-03-20',
      status: true
    },
    {
      id: 4,
      title: 'Ingeniero DevOps',
      description: 'Ingeniero DevOps para gestionar infraestructura cloud, CI/CD y automatización de procesos',
      company: 'GreenTech Solutions',
      salary: 48000,
      location: 'Remoto',
      modality: 'Tiempo Completo',
      ubication: 'Sevilla, España',
      applications: [
        { id: 4, firstName: 'Ana', lastName: 'Martínez' },
        { id: 5, firstName: 'David', lastName: 'Fernández' }
      ],
      closingDate: '2024-02-28',
      status: false
    },
    {
      id: 5,
      title: 'Desarrollador Full Stack',
      description: 'Desarrollador full stack con experiencia en React, Node.js y bases de datos relacionales',
      company: 'HealthCare Plus',
      salary: 42000,
      location: 'Presencial',
      modality: 'Medio Tiempo',
      ubication: 'Bilbao, España',
      applications: [],
      closingDate: '2024-03-25',
      status: true
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Ofertas de Trabajo</h2>
          <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oferta
          </button>
        </div>

        {/* Botón de exportar */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabla de ofertas con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable 
          data={jobs} 
          columns={jobColumns} 
          searchKey="title"
          searchPlaceholder="Buscar ofertas por título, empresa o descripción..."
        />
      </div>
    </div>
  );
} 