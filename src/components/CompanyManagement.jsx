import  { useEffect, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { companyColumns } from './columns/company-columns';
import CompanyModal from './CompanyModal';
import { useEnterprise } from '../shared/hooks/useEnterprise';
import EnterpriseForm from './EnterpriseForm';

export default function CompanyManagement() {
  const { enterprise, getEnterprises, deleteEnterprise, saveEnterprise, updateEnterprise } = useEnterprise();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleViewProfile = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleEditCompany = (companyAdapted) => {
    const originalCompany = enterprise?.enterprises?.find(
      (c) => c.id === companyAdapted.id
    );

    if (originalCompany) {
      setSelectedCompanyForEdit(originalCompany);
      setIsEditing(true);
      console.log("Editing company:", originalCompany);
    }
  };

  useEffect(() => {
    getEnterprises();
  }, []);

  const enterprises = enterprise?.enterprises || []; 

  const companies = enterprises.map((company) => ({
    id: company.id,
    name: company.name,
    description: company.description,
    website: company.webSite,
    sector: company.industry,
    location: company.address,
    email: company.email,
    status: company.status ? 'Activa' : 'Inactiva',
    adminUser: company.recruiters?.length
    ? {
        firstName: company.recruiters[0].firstName,
        lastName: company.recruiters[0].lastName,
        email: company.recruiters[0].email,
      }
    : {firstName: 'N/A', lastName: 'N/A', email: 'N/A'},
    contactNumber: company.contactNumber || 'No disponible',
  }));

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Empresas
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
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
      {(isCreating || isEditing) && (
        <div className="bg-white rounded-lg shadow p-6">
          <EnterpriseForm
            title={isEditing ? "Editar empresa" : "Crear nueva empresa"}
            initialData={isEditing ? selectedCompanyForEdit : {}}
            onCancel={() => {
              setIsCreating(false);
              setIsEditing(false);
              setSelectedCompanyForEdit(null);
            }}
            onSubmit={async (data) => {
              if (isEditing && selectedCompanyForEdit) {
                await updateEnterprise(selectedCompanyForEdit.id, data); // Llama al método correcto
              } else {
                await saveEnterprise(data); // Sigue creando si no estás editando
              }

              await getEnterprises();
              setIsCreating(false);
              setIsEditing(false);
              setSelectedCompanyForEdit(null);
            }}
          />
        </div>
      )}
      {/* Tabla de empresas con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={companies}
          columns={companyColumns({
            deleteEnterprise,
            onViewProfile: handleViewProfile,
            onEdit: handleEditCompany,
          })}
          searchKey={["name", "email", "adminUser.firstName"]}
          searchPlaceholder="Buscar empresas por nombre, descripción o sector..."
          columnVisibility={{
            status: false,
            location: false,
          }}
        />
      </div>

      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
      />
    </div>
  );
} 