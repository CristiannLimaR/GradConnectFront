import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminStats from '../components/AdminStats';
import UserManagement from '../components/UserManagement';
import CompanyManagement from '../components/CompanyManagement';
import JobManagement from '../components/JobManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeUsers: 0,
    activeCompanies: 0,
    activeJobs: 0,
    applicationsThisMonth: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getAdminDashboardStats();
      if (stats && !stats.error) {
        setStats(stats);
      }
    };
    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'jobs':
        return <JobManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona usuarios, empresas, ofertas y estadísticas de la plataforma
              </p>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 