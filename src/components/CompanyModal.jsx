import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener esta utilidad o reemplaza con clsx

export default function CompanyModal({ company, isOpen, onClose }) {
  const [animationState, setAnimationState] = useState("closed");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setAnimationState("open"));
    } else if (isVisible) {
      setAnimationState("closed");
      const timeout = setTimeout(() => setIsVisible(false), 200); // igual a duration-200
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!company) return null;

  return (
    <>
      {isVisible && (
        <>
          {/* Fondo oscuro con animación */}
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/50 duration-200",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
            )}
            data-state={animationState}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal con animaciones y estructura */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            data-state={animationState}
            className={cn(
              "bg-background fixed top-[50%] left-[50%] z-50 grid w-11/12 max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 overflow-y-auto max-h-[90vh]",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            {/* Encabezado */}
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
                <p>
                  <strong>Administrador:</strong>{" "}
                  {company.adminUser?.firstName} {company.adminUser?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {company.adminUser?.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {company.contactNumber || "No disponible"}
                </p>
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
                <p>
                  <strong>Ubicación:</strong> {company.location || "No especificada"}
                </p>
                <p>
                  <strong>Sector:</strong> {company.sector || "No especificado"}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={cn(
                      "capitalize px-2 py-1 rounded-full text-xs font-medium",
                      company.status === "Activa"
                        ? "bg-green-100 text-green-800"
                        : company.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {company.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
