import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegister } from "../shared/hooks/useRegister";

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  // Datos de usuario
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { registerUser, isLoading } = useRegister();

  const handleRoleSelect = (selectedRole) => {
    const roleValue = selectedRole === "trabajo" ? "CANDIDATE" : "RECRUITER";
    setRole(roleValue);
    setValue("role", roleValue);
    setError("");
    setStep(2);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setValue("profileImage", file);
    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file));
    } else {
      setProfilePhotoPreview("");
    }
  };

  const onSubmit = (data) => {
    if (!data.firstName || !data.lastName || !data.email || !data.password || !data.userLocation || !data.phone) {
      setError("Por favor, completa todos los campos obligatorios del usuario.");
      return;
    }
    setError("");
    // Si hay foto de perfil, usar FormData
    let formData;
    if (data.profilePhoto) {
      formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "location") {
          formData.append("location", value);
        } else {
          formData.append(key, value);
        }
      });
    }
    registerUser(formData || data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <label className="block text-sm font-medium mb-2">¿Qué estás buscando?</label>
              <div className="flex gap-4 mt-2">
                <Button variant={role === "CANDIDATE" ? "default" : "outline"} className="flex-1" onClick={() => handleRoleSelect("trabajo")}>Buscar trabajo</Button>
                <Button variant={role === "RECRUITER" ? "default" : "outline"} className="flex-1" onClick={() => handleRoleSelect("contratar")}>Reclutar</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("role", { required: true })} value={role} />
              {/* FOTO DE PERFIL */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <label htmlFor="profileImageInput" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full border-2 border-blue-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:shadow-lg transition-all">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Previsualización" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#60a5fa" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" />
                      </svg>
                    )}
                  </div>
                </label>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="profilePhoto"
                  onChange={handleProfilePhotoChange}
                />
                <span className="text-xs text-gray-500">Haz clic en el círculo para subir una foto</span>
              </div>
              {/* DATOS DE USUARIO */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Datos de usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      {...register("firstName", { required: true })}
                    />
                    {errors.firstName && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      {...register("lastName", { required: true })}
                    />
                    {errors.lastName && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña</label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    {...register("password", { required: true })}
                  />
                  {errors.password && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    {...register("location", { required: true })}
                  />
                  {errors.location && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full border rounded px-3 py-2"
                    {...register("phone", { required: true })}
                  />
                  {errors.phone && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button className="w-full" type="submit" disabled={isLoading}>{isLoading ? "Registrando..." : "Registrarse"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>Volver</Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          <span className="text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link></span>
        </CardFooter>
      </Card>
    </div>
  );
} 