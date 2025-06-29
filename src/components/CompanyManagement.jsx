import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { companyColumns } from './columns/company-columns';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      description: 'Empresa líder en desarrollo de software y soluciones tecnológicas innovadoras para el sector empresarial',
      website: 'https://techcorp.com',
      location: 'Madrid, España',
      sector: 'Tecnología',
      adminUser: {
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana.garcia@techcorp.com'
      },
      email: 'contact@techcorp.com',
      status: 'verificada'
    },
    {
      id: 2,
      name: 'InnovateLab',
      description: 'Startup innovadora especializada en inteligencia artificial y machine learning para aplicaciones empresariales',
      website: 'https://innovatelab.com',
      location: 'Barcelona, España',
      sector: 'Inteligencia Artificial',
      adminUser: {
        firstName: 'Carlos',
        lastName: 'Martínez',
        email: 'carlos.martinez@innovatelab.com'
      },
      email: 'hr@innovatelab.com',
      status: 'pendiente'
    },
    {
      id: 3,
      name: 'DataCorp International',
      description: 'Consultoría especializada en análisis de datos, big data y business intelligence para empresas globales',
      website: 'https://datacorp.com',
      location: 'Valencia, España',
      sector: 'Consultoría',
      adminUser: {
        firstName: 'María',
        lastName: 'López',
        email: 'maria.lopez@datacorp.com'
      },
      email: 'info@datacorp.com',
      status: 'verificada'
    },
    {
      id: 4,
      name: 'GreenTech Solutions',
      description: 'Soluciones sostenibles y tecnologías verdes para un futuro más limpio y eficiente energéticamente',
      website: 'https://greentech.com',
      location: 'Sevilla, España',
      sector: 'Energía Renovable',
      adminUser: {
        firstName: 'David',
        lastName: 'Fernández',
        email: 'david.fernandez@greentech.com'
      },
      email: 'info@greentech.com',
      status: 'suspendida'
    },
    {
      id: 5,
      name: 'HealthCare Plus',
      description: 'Servicios de salud integrales y tecnología médica avanzada para mejorar la calidad de vida de los pacientes',
      website: 'https://healthcare.com',
      location: 'Bilbao, España',
      sector: 'Salud',
      adminUser: {
        firstName: 'Laura',
        lastName: 'Rodríguez',
        email: 'laura.rodriguez@healthcare.com'
      },
      email: 'contact@healthcare.com',
      status: 'pendiente'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h2>
          <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Empresa
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

      {/* Tabla de empresas con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable 
          data={companies} 
          columns={companyColumns} 
          searchKey="name"
          searchPlaceholder="Buscar empresas por nombre, descripción o sector..."
        />
      </div>
    </div>
  );
} 