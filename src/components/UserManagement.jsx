import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { userColumns as getUserColumns } from './columns/user-columns';
import { useAdminUsers } from '../shared/hooks/useAdminUsers';
import apiClient from '../service/api';
import CreateUserModal from './CreateUserModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const { loading, updateUser, deleteUser } = useAdminUsers();
  const [editUser, setEditUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/user');
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, data) => {
    const updatedUser = await updateUser(id, data);
    if (updatedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updatedUser } : u))
      );
    }
  };

  const handleDeleteUser = async (id) => {
    const success = await deleteUser(id);
    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Nueva función para activar/desactivar usuario
  const toggleUserStatus = async (user) => {
    try {
      const updatedStatus = !user.status;
      // Actualiza el usuario con el nuevo estado (status)
      const res = await apiClient.put(`/user/${user.id}`, { status: updatedStatus });
      if (res && !res.error) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: updatedStatus } : u))
        );
      } else {
        console.error('Error al actualizar estado de usuario');
      }
    } catch (error) {
      console.error('Error en toggleUserStatus:', error);
    }
  };

  const openCreateForm = () => {
    setEditUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    setEditUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditUser(null);
  };

  // Pasamos toggleUserStatus y openEditForm a userColumns
  const userColumns = getUserColumns({
    onEditClick: openEditForm,
    onToggleStatus: toggleUserStatus,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <button
            onClick={openCreateForm}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-6 bg-gray-50 rounded-md p-4 shadow-inner border border-gray-300">
            <CreateUserModal
              isOpen={isFormOpen}
              onClose={closeForm}
              onSuccess={fetchUsers}
              user={editUser}
              isInline
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={users}
          columns={userColumns}
          searchKey="firstName"
          searchPlaceholder="Buscar usuarios por nombre, email o ubicación..."
          onEdit={handleUpdateUser}
          onDelete={handleDeleteUser}
          loading={loading}
        />
      </div>
    </div>
  );
}
