import React from 'react';

export default function ProfileProgressBar({ porcentaje }) {
  // El porcentaje debe venir por props o desde un hook de API
  return (
    <div className="w-full px-4 md:px-16 pt-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Completitud del perfil</span>
          <span className="text-sm font-semibold text-blue-700">{porcentaje}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all duration-300 ${porcentaje === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${porcentaje}%` }}></div>
        </div>
      </div>
    </div>
  );
} 