import  { useEffect, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DataTable } from './data-table';
import { companyColumns } from './columns/company-columns';
import CompanyModal from './CompanyModal';
import { useEnterprise } from '../shared/hooks/useEnterprise';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import CompanyForm from './CompanyForm';

export default function CompanyManagement() {
  const { enterprise, getEnterprises, deleteEnterprise, saveEnterprise, updateEnterprise } = useEnterprise();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleViewProfile = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (isEditing && selectedCompany) {
        // Update existing company
        result = await updateEnterprise(selectedCompany.id, formData);
      } else {
        // Create new company
        result = await saveEnterprise(formData);
      }
      
      // Check if the operation was successful
      if (!result?.error) {
        setIsDialogOpen(false);
        setSelectedCompany(null);
        // Refresh the enterprises list
        await getEnterprises();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={handleAddCompany}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Empresa
          </button>
        </div>

        
      </div>

      {/* Tabla de empresas con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={companies}
          columns={companyColumns({
            deleteEnterprise,
            onViewProfile: handleViewProfile,
            onEditCompany: handleEditCompany
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Empresa' : 'Agregar Nueva Empresa'}
            </DialogTitle>
          </DialogHeader>
          <CompanyForm
            company={isEditing ? selectedCompany : null}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedCompany(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 