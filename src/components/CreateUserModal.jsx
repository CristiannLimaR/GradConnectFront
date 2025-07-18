import { useState, useEffect } from "react";
import { register, adminUpdateUser } from "../service/api";
import { toast } from "sonner";

function sanitizeUser(user) {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    password: "", // nunca mostramos contraseña en edición
    role: user.role || "CANDIDATE",
    location: user.location || "",
    phone: user.phone || "",
    linkedinUrl: user.linkedinUrl || "",
    profilePhoto: user.profilePhoto || "",
    summary: user.summary || "",
  };
}

export default function CreateUserModal({ isOpen, onClose, onSuccess, user, isInline = false }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CANDIDATE",
    location: "",
    phone: "",
    linkedinUrl: "",
    profilePhoto: "",
    summary: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(sanitizeUser(user));
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "CANDIDATE",
        location: "",
        phone: "",
        linkedinUrl: "",
        profilePhoto: "",
        summary: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res;
    if (user) {
      const { password, ...rest } = form;
      res = await adminUpdateUser(user.id, rest);
    } else {
      res = await register(form);
    }

    setLoading(false);

    if (res.error) {
      if (res.e?.response?.data?.errors) {
        res.e.response.data.errors.forEach(({ msg, param }) => {
          toast.error(`${param}: ${msg}`);
        });
      } else {
        toast.error("Error al procesar usuario");
      }
    } else {
      toast.success(user ? "Usuario actualizado" : "Usuario creado");
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  // Si es inline, renderizamos panel dentro del flujo, si no modal fijo
  if (isInline) {
    return (
      <div className="bg-white rounded-md p-6 shadow-md border border-gray-300">
        <h2 className="text-lg font-bold mb-4">{user ? "Editar usuario" : "Crear nuevo usuario"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Todos los inputs igual */}
          <input
            name="firstName"
            placeholder="Nombre"
            className="w-full border p-2 rounded"
            value={form.firstName}
            onChange={handleChange}
            required
            maxLength={40}
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
            title="Solo letras y espacios"
          />
          <input
            name="lastName"
            placeholder="Apellido"
            className="w-full border p-2 rounded"
            value={form.lastName}
            onChange={handleChange}
            required
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
            title="Solo letras y espacios"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          {!user && (
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full border p-2 rounded"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          )}
          <select
            name="role"
            className="w-full border p-2 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="CANDIDATE">Candidato</option>
            <option value="RECRUITER">Reclutador</option>
            <option value="GRADCONNECT">Admin</option>
          </select>

          <input
            name="location"
            placeholder="Ubicación"
            className="w-full border p-2 rounded"
            value={form.location}
            onChange={handleChange}
            maxLength={100}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Teléfono"
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={handleChange}
            pattern="^\+?[0-9\s\-]{7,15}$"
            title="Número de teléfono válido"
          />

          <input
            name="linkedinUrl"
            type="url"
            placeholder="URL LinkedIn"
            className="w-full border p-2 rounded"
            value={form.linkedinUrl}
            onChange={handleChange}
          />

          <input
            name="profilePhoto"
            type="url"
            placeholder="URL Foto de perfil"
            className="w-full border p-2 rounded"
            value={form.profilePhoto}
            onChange={handleChange}
          />

          <textarea
            name="summary"
            placeholder="Resumen personal (opcional)"
            className="w-full border p-2 rounded"
            value={form.summary}
            onChange={handleChange}
            maxLength={1000}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : user ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Si no es inline (modo modal original fijo)
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-90">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">{user ? "Editar usuario" : "Crear nuevo usuario"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ... inputs idénticos */}
          <input
            name="firstName"
            placeholder="Nombre"
            className="w-full border p-2 rounded"
            value={form.firstName}
            onChange={handleChange}
            required
            maxLength={40}
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
            title="Solo letras y espacios"
          />
          <input
            name="lastName"
            placeholder="Apellido"
            className="w-full border p-2 rounded"
            value={form.lastName}
            onChange={handleChange}
            required
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$"
            title="Solo letras y espacios"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          {!user && (
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full border p-2 rounded"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          )}
          <select
            name="role"
            className="w-full border p-2 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="CANDIDATE">Candidato</option>
            <option value="RECRUITER">Reclutador</option>
            <option value="GRADCONNECT">Admin</option>
          </select>

          <input
            name="location"
            placeholder="Ubicación"
            className="w-full border p-2 rounded"
            value={form.location}
            onChange={handleChange}
            maxLength={100}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Teléfono"
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={handleChange}
            pattern="^\+?[0-9\s\-]{7,15}$"
            title="Número de teléfono válido"
          />

          <input
            name="linkedinUrl"
            type="url"
            placeholder="URL LinkedIn"
            className="w-full border p-2 rounded"
            value={form.linkedinUrl}
            onChange={handleChange}
          />

          <input
            name="profilePhoto"
            type="url"
            placeholder="URL Foto de perfil"
            className="w-full border p-2 rounded"
            value={form.profilePhoto}
            onChange={handleChange}
          />

          <textarea
            name="summary"
            placeholder="Resumen personal (opcional)"
            className="w-full border p-2 rounded"
            value={form.summary}
            onChange={handleChange}
            maxLength={1000}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : user ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
