import React from 'react';
import { Users, Building2, Briefcase } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      description: 'Gestionar usuarios'
    },
    {
      id: 'companies',
      label: 'Empresas',
      icon: Building2,
      description: 'Gestionar empresas'
    },
    {
      id: 'jobs',
      label: 'Ofertas',
      icon: Briefcase,
      description: 'Gestionar ofertas'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Admin</h2>
            <p className="text-sm text-gray-500">Panel de control</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
} 