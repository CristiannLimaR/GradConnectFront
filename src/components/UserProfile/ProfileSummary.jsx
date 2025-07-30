import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import EditProfileForm from "./EditProfileForm"; // Ajusta ruta si es necesario
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";

export default function ProfileSummary({ profile, refreshProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCVDialog, setShowCVDialog] = useState(false);

  const handleEditSuccess = (updatedProfile) => {
    setIsEditing(false);
    if (refreshProfile) {
      refreshProfile(updatedProfile);
    }
  };

  return (
    <div className="bg-white border rounded p-6 relative max-w-5xl mx-auto">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <button
            className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
          >
            <Edit2 className="w-4 h-4" /> Editar
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Editar perfil</DialogTitle>
          <EditProfileForm
            onClose={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
            isInline={false}
            currentProfile={profile}
          />
        </DialogContent>
      </Dialog>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Perfil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-2">
            <span className="font-semibold">Nombre:</span> {profile.nombre || "Nombre"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Apellido:</span> {profile.apellido || "Apellido"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Descripción:</span>{" "}
            {profile.descripcion || <span className="text-gray-400">Sin descripción</span>}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span> {profile.email || "Email"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Ubicación:</span> {profile.ubicacion || "Ubicación"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Teléfono:</span> {profile.telefono || "Teléfono"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">GitHub:</span>{" "}
            {profile.github ? (
              <a
                href={profile.github}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.github}
              </a>
            ) : (
              "No especificado"
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">LinkedIn:</span>{" "}
            {profile.linkedin ? (
              <a
                href={profile.linkedin}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.linkedin}
              </a>
            ) : (
              "No especificado"
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">CV:</span>{" "}
            {profile.cv ? (
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
            ) : (
              "No subido"
            )}
          </div>
        </div>
      </div>
      {showCVDialog && profile.cv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowCVDialog(false)}
              aria-label="Cerrar previsualización CV"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2">Previsualización del CV</h2>
            <embed src={URL.createObjectURL(profile.cv)} type="application/pdf" width="100%" height="500px" />
          </div>
        </div>
      )}
    </div>
  );
}
