import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { userColumns } from './columns/user-columns';

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      role: 'CANDIDATE',
      location: 'Madrid, España',
      phone: '+34 600 111 111',
      linkedinUrl: 'https://linkedin.com/in/juanperez',
      profilePhoto: null,
      registrationDate: '2024-01-15',
      status: true
    },
    {
      id: 2,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@email.com',
      role: 'RECRUITER',
      location: 'Barcelona, España',
      phone: '+34 600 222 222',
      linkedinUrl: 'https://linkedin.com/in/mariagarcia',
      profilePhoto: null,
      registrationDate: '2024-01-10',
      status: true
    },
    {
      id: 3,
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@email.com',
      role: 'CANDIDATE',
      location: 'Valencia, España',
      phone: '+34 600 333 333',
      linkedinUrl: null,
      profilePhoto: null,
      registrationDate: '2024-01-20',
      status: true
    },
    {
      id: 4,
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@email.com',
      role: 'GRADCONNECT',
      location: 'Sevilla, España',
      phone: '+34 600 444 444',
      linkedinUrl: 'https://linkedin.com/in/anamartinez',
      profilePhoto: null,
      registrationDate: '2024-01-05',
      status: true
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Fernández',
      email: 'david.fernandez@email.com',
      role: 'CANDIDATE',
      location: 'Bilbao, España',
      phone: '+34 600 555 555',
      linkedinUrl: 'https://linkedin.com/in/davidfernandez',
      profilePhoto: null,
      registrationDate: '2024-01-25',
      status: false
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
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

      {/* Tabla de usuarios con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable 
          data={users} 
          columns={userColumns} 
          searchKey="firstName"
          searchPlaceholder="Buscar usuarios por nombre, email o ubicación..."
        />
      </div>
    </div>
  );
} 