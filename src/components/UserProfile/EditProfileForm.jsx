import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAuthStore from "../../shared/stores/authStore";
import { useProfile } from "../../shared/hooks/useProfile";

export default function EditProfileForm({ onClose, onSuccess, isInline = false }) {
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    ubicacion: "",
    telefono: "",
    linkedin: "",
    github: "",
    descripcion: "",
    cv: null,
    passwordConfirm: "",
    newPassword: "",
    newPasswordConfirm: ""
  });

  const { isSaving, saveProfile, savePassword } = useProfile();

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.firstName || "",
        apellido: user.lastName || "",
        email: user.email || "",
        ubicacion: user.location || "",
        telefono: user.phone || "",
        linkedin: user.linkedinUrl || user.linkedin || "",
        github: user.github || "",
        descripcion: user.summary || user.description || "",
        cv: null,
        passwordConfirm: "",
        newPassword: "",
        newPasswordConfirm: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generalDataChanged =
      form.nombre !== (user.firstName || "") ||
      form.apellido !== (user.lastName || "") ||
      form.email !== (user.email || "") ||
      form.ubicacion !== (user.location || "") ||
      form.telefono !== (user.phone || "") ||
      form.linkedin !== (user.linkedinUrl || user.linkedin || "") ||
      form.github !== (user.github || "") ||
      form.descripcion !== (user.summary || user.description || "") ||
      form.cv !== null;

    const wantsPasswordChange =
      form.newPassword !== "" || form.newPasswordConfirm !== "" || form.passwordConfirm !== "";

    if (wantsPasswordChange) {
      if (!form.passwordConfirm) {
        toast.error("Para cambiar la contraseña, debes confirmar tu contraseña actual.");
        return;
      }
      if (form.newPassword !== form.newPasswordConfirm) {
        toast.error("La nueva contraseña y su confirmación no coinciden.");
        return;
      }
    }

    if (!generalDataChanged && !wantsPasswordChange) {
      toast.error("No has modificado nada para actualizar.");
      return;
    }

    try {
      if (generalDataChanged) {
        const formData = new FormData();
        formData.append("firstName", form.nombre);
        formData.append("lastName", form.apellido);
        formData.append("email", form.email);
        formData.append("location", form.ubicacion);
        formData.append("phone", form.telefono);
        formData.append("linkedinUrl", form.linkedin);
        formData.append("github", form.github);
        formData.append("summary", form.descripcion);
        if (form.cv) formData.append("cvAdjunto", form.cv);

        const success = await saveProfile(formData);
        if (!success) return;
      }

      if (wantsPasswordChange) {
        const success = await savePassword({
          passwordConfirm: form.passwordConfirm,
          newPassword: form.newPassword
        });
        if (!success) return;
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error("Error al actualizar el perfil.");
    }
  };

  return (
    <div className={`${!isInline ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25" : ""}`}>
      <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-auto ${isInline ? "" : "mx-4"}`}>
        {!isInline && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        )}

        <h2 className="text-xl font-bold mb-4">Editar perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Datos generales */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold mb-2">Datos generales</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nombre"
                placeholder="Nombre"
                className="border p-2 rounded w-full"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                name="apellido"
                placeholder="Apellido"
                className="border p-2 rounded w-full"
                value={form.apellido}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Correo"
                className="border p-2 rounded w-full"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="telefono"
                placeholder="Teléfono"
                className="border p-2 rounded w-full"
                value={form.telefono}
                onChange={handleChange}
              />
              <input
                name="ubicacion"
                placeholder="Ubicación"
                className="border p-2 rounded w-full"
                value={form.ubicacion}
                onChange={handleChange}
              />
              <input
                name="linkedin"
                placeholder="LinkedIn"
                className="border p-2 rounded w-full"
                value={form.linkedin}
                onChange={handleChange}
              />
              <input
                name="github"
                placeholder="GitHub"
                className="border p-2 rounded w-full"
                value={form.github}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* CV */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold mb-2">CV</legend>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              disabled={isSaving}
            />
          </fieldset>

          {/* Cambiar contraseña */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="font-semibold mb-2">Cambiar contraseña</legend>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Contraseña actual"
              className="border p-2 rounded w-full mb-2"
              value={form.passwordConfirm}
              onChange={handleChange}
              disabled={isSaving}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Nueva contraseña"
              className="border p-2 rounded w-full mb-2"
              value={form.newPassword}
              onChange={handleChange}
              disabled={isSaving}
            />
            <input
              type="password"
              name="newPasswordConfirm"
              placeholder="Confirmar nueva contraseña"
              className="border p-2 rounded w-full"
              value={form.newPasswordConfirm}
              onChange={handleChange}
              disabled={isSaving}
            />
          </fieldset>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSaving}
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
