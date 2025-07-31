import React from 'react';
import { User, Upload, Github, Linkedin } from 'lucide-react';

export default function ProfileHeader({ profile, showCVDialog, setShowCVDialog, setEditProfile }) {
  // Aquí puedes recibir los datos del usuario por props o desde un hook de API
  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-end gap-8 px-4 md:px-16 pt-10 pb-8 border-b">
      <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow">
          {profile.foto ? (
            <img src={URL.createObjectURL(profile.foto)} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : (
            <User className="w-20 h-20 text-blue-400" />
          )}
        </div>
        <label className="cursor-pointer text-blue-600 hover:underline flex items-center gap-2 text-sm">
          <Upload className="w-4 h-4" /> Cambiar foto
          <input type="file" name="foto" accept="image/*" className="hidden" disabled />
        </label>
      </div>
      <div className="flex-1 flex flex-col items-center md:items-start gap-2">
        <h2 className="text-3xl font-bold text-gray-900">{profile.nombre || 'Nombre'} {profile.apellido || 'Apellido'}</h2>
        {profile.descripcion && (
          <p className="text-gray-700 text-base mb-2 mt-1 max-w-xl">{profile.descripcion}</p>
        )}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-gray-500 text-base">
          <span>{profile.email || 'Email'}</span>
          <span className="hidden md:inline">|</span>
          <span>{profile.ubicacion || 'Ubicación'}</span>
          <span className="hidden md:inline">|</span>
          <span>{profile.telefono || 'Teléfono'}</span>
        </div>
        <div className="flex gap-4 mt-2">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700"><Github className="w-6 h-6" /></a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700"><Linkedin className="w-6 h-6" /></a>
          )}
        </div>
        <button onClick={() => setEditProfile(true)} className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">Editar perfil</button>
        <div className="mt-2">
          <span className="font-semibold">CV:</span> {profile.cv ? (
            <>
              <span className="text-blue-600">{profile.cv.name}</span>
              <button
                type="button"
                className="ml-2 text-blue-600 underline hover:text-blue-800 text-sm"
                onClick={() => setShowCVDialog(true)}
              >
                Ver
              </button>
            </>
          ) : 'No subido'}
        </div>
        {/* Modal para previsualización del CV */}
        {showCVDialog && profile.cv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowCVDialog(false)}
              >
                ×
              </button>
              <h2 className="text-lg font-semibold mb-2">Previsualización del CV</h2>
              <embed
                src={URL.createObjectURL(profile.cv)}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 