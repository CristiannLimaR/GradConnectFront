import React from "react";

export default function CompanyModal({ company, isOpen, onClose }) {
  if (!isOpen || !company) return null;

  return (
    <>
      <div
        className="fixed  bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-200 p-6 shadow-lg  overflow-y-auto max-h-[90vh]"
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold">
            {company.name}
          </h2>
          <button
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-900 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </header>

        <div className="flex flex-col gap-6">
          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contacto</h3>
            <p><strong>Administrador:</strong> {company.adminUser?.firstName} {company.adminUser?.lastName}</p>
            <p><strong>Email:</strong> {company.adminUser?.email}</p>
            <p><strong>Teléfono:</strong> {company.contactNumber || "No disponible"}</p>
            <p>
              <strong>Sitio Web:</strong>{" "}
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website}
                </a>
              ) : (
                "No disponible"
              )}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p>{company.description || "No hay descripción disponible."}</p>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Información</h3>
            <p><strong>Ubicación:</strong> {company.location || "No especificada"}</p>
            <p><strong>Sector:</strong> {company.sector || "No especificado"}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                  company.status === "Activa"
                    ? "bg-green-100 text-green-800"
                    : company.status === "Pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {company.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
