import React, { useEffect, useState } from "react";
import { Plus, Download } from "lucide-react";
import { DataTable } from "./data-table";
import { jobColumns } from "./columns/job-columns";
import { useOffer } from "../shared/hooks/useWOffer";

export default function JobManagement() {
  const { offers, getWOffers } = useOffer();

  useEffect(() => {
    getWOffers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Ofertas de Trabajo
          </h2>
        </div>
      </div>

      {/* Tabla de ofertas con DataTable */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={offers}
          columns={jobColumns}
          searchKey="title"
          searchPlaceholder="Buscar ofertas por título, empresa o descripción..."
        />
      </div>
    </div>
  );
}
