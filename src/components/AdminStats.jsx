import React from 'react';
import { Users, Building2, Briefcase, FileText, User, Clock } from 'lucide-react';

export default function AdminStats({ stats }) {
  const statCards = [
    {
      title: 'Total de Usuarios',
      value: stats.totalUsers,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Empresas Activas',
      value: stats.activeCompanies,
      change: '+5%',
      changeType: 'positive',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Ofertas Activas',
      value: stats.activeJobs,
      change: '+8%',
      changeType: 'positive',
      icon: Briefcase,
      color: 'purple'
    },
    {
      title: 'Aplicaciones este mes',
      value: stats.applicationsThisMonth,
      change: '+15%',
      changeType: 'positive',
      icon: FileText,
      color: 'orange'
    }
  ];

  const recentActivity = [
    {
      type: 'user',
      action: 'Nuevo usuario registrado',
      details: 'María García se unió a la plataforma',
      time: 'Hace 5 minutos',
      icon: User
    },
    {
      type: 'company',
      action: 'Nueva empresa verificada',
      details: 'TechCorp completó su verificación',
      time: 'Hace 15 minutos',
      icon: Building2
    },
    {
      type: 'job',
      action: 'Nueva oferta publicada',
      details: 'Frontend Developer en InnovateLab',
      time: 'Hace 1 hora',
      icon: Briefcase
    },
    {
      type: 'application',
      action: 'Aplicación recibida',
      details: 'Carlos López aplicó a Senior Developer',
      time: 'Hace 2 horas',
      icon: FileText
    }
  ];

  return (
    <div className="space-y-8">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-${stat.color}-100`}>
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos y métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Métricas detalladas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Detalladas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Usuarios activos</span>
              <span className="font-semibold">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nuevos usuarios este mes</span>
              <span className="font-semibold text-green-600">+{stats.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de ofertas</span>
              <span className="font-semibold">{stats.totalJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de conversión</span>
              <span className="font-semibold text-blue-600">23.4%</span>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                    <p className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-4 h-4 mr-2" />
            Ver todos los usuarios
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Building2 className="w-4 h-4 mr-2" />
            Gestionar empresas
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Generar reporte
          </button>
        </div>
      </div>
    </div>
  );
} 