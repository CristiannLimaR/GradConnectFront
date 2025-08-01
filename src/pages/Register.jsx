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
  const [companyLogoPreview, setCompanyLogoPreview] = useState("");
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
    setValue("profilePhoto", file);
    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file));
    } else {
      setProfilePhotoPreview("");
    }
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    setValue("logo", file);
    if (file) {
      setCompanyLogoPreview(URL.createObjectURL(file));
    } else {
      setCompanyLogoPreview("");
    }
  };



  const handleUserDataSubmit = (data) => {
    // Si es recruiter, ir al paso 3 para datos de empresa
    if (role === "RECRUITER") {
      // Limpiar la previsualización de la foto de perfil del Step 2
      setProfilePhotoPreview("");
      setStep(3);
    } else {
      // Si es candidate, enviar directamente
      submitForm(data);
    }
  };

  const submitForm = (data) => {
    console.log("Datos del formulario:", data);
    
    // Separar datos del usuario y datos de empresa
    const userData = {};
    const enterpriseData = {};
    
    // Campos del usuario
    const userFields = ['role', 'firstName', 'lastName', 'email', 'password', 'location', 'phone', 'profilePhoto'];
    // Campos de la empresa
    const enterpriseFields = ['companyName', 'companyEmail', 'companyContactNumber', 'companyWebsite', 'companyAddress', 'industry', 'companyType', 'companySize', 'companyDescription', 'logo'];
    
    Object.entries(data).forEach(([key, value]) => {
      if (userFields.includes(key)) {
        userData[key] = value;
      } else if (enterpriseFields.includes(key)) {
        enterpriseData[key] = value;
      }
    });
    
    // Crear FormData para datos del usuario si hay foto de perfil
    let userFormData;
    if (userData.profilePhoto) {
      userFormData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (key === "location") {
          userFormData.append("location", value);
        } else if (key === "profilePhoto") {
          userFormData.append(key, value);
        } else {
          userFormData.append(key, value);
        }
      });
      console.log("FormData de usuario creado con campos:", Array.from(userFormData.entries()));
    }
    
    // Pasar datos de empresa solo si es recruiter
    const finalUserData = userFormData || userData;
    const finalEnterpriseData = role === "RECRUITER" ? enterpriseData : null;
    
    registerUser(finalUserData, finalEnterpriseData);
  };

  const onSubmit = (data) => {
    submitForm(data);
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
            <form onSubmit={handleSubmit(handleUserDataSubmit)} className="space-y-4">
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
              <Button className="w-full" type="submit" disabled={isLoading}>
                {role === "RECRUITER" ? "Siguiente" : (isLoading ? "Registrando..." : "Registrarse")}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>Volver</Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("role", { required: true })} value={role} />
              {/* DATOS DE LA EMPRESA */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Datos de la empresa</h3>
                
                {/* Primera fila: Nombre y Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de la empresa</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      {...register("companyName", { required: true })}
                    />
                    {errors.companyName && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo de la empresa</label>
                    <div className="flex flex-col items-center gap-2">
                      <label htmlFor="companyLogoInput" className="cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-2 border-blue-300 flex items-center justify-center overflow-hidden bg-gray-100 hover:shadow-lg transition-all">
                          {companyLogoPreview ? (
                            <img src={companyLogoPreview} alt="Previsualización del logo" className="w-full h-full object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#60a5fa" className="w-12 h-12">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          )}
                        </div>
                      </label>
                      <input
                        id="companyLogoInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        name="logo"
                        onChange={handleCompanyLogoChange}
                      />
                      <span className="text-xs text-gray-500">Haz clic en el círculo para subir el logo</span>
                    </div>
                    {errors.companyLogo && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                </div>

                {/* Segunda fila: Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email de la empresa</label>
                    <input
                      type="email"
                      className="w-full border rounded px-3 py-2"
                      {...register("companyEmail", { required: true })}
                      placeholder="empresa@ejemplo.com"
                    />
                    {errors.companyEmail && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de contacto</label>
                    <input
                      type="tel"
                      className="w-full border rounded px-3 py-2"
                      {...register("companyContactNumber", { required: true })}
                      placeholder="+1234567890"
                    />
                    {errors.companyContactNumber && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                </div>

                {/* Tercera fila: Sitio web y Dirección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sitio web de la empresa</label>
                    <input
                      type="url"
                      className="w-full border rounded px-3 py-2"
                      {...register("companyWebsite")}
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dirección de la empresa</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      {...register("companyAddress", { required: true })}
                      placeholder="Calle, Ciudad, País"
                    />
                    {errors.companyAddress && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                </div>

                {/* Cuarta fila: Industria y Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Industria</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      {...register("industry", { required: true })}
                    >
                      <option value="">Selecciona la industria</option>
                      <option value="Technology">Tecnología</option>
                      <option value="Health">Salud</option>
                      <option value="Education">Educación</option>
                      <option value="Finance">Finanzas</option>
                      <option value="Retail">Comercio minorista</option>
                      <option value="Manufacturing">Manufactura</option>
                      <option value="Hospitality">Hospitalidad</option>
                      <option value="Construction">Construcción</option>
                      <option value="Others">Otros</option>
                    </select>
                    {errors.industry && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de empresa</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      {...register("companyType", { required: true })}
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="Startup">Startup</option>
                      <option value="SME">PYME</option>
                      <option value="Corporation">Corporación</option>
                      <option value="Non-Profit">Sin fines de lucro</option>
                    </select>
                    {errors.companyType && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                </div>

                {/* Quinta fila: Tamaño y Descripción */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tamaño de la empresa</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      {...register("companySize", { required: true })}
                    >
                      <option value="">Selecciona el tamaño</option>
                      <option value="Small">Pequeña</option>
                      <option value="Medium">Mediana</option>
                      <option value="Large">Grande</option>
                    </select>
                    {errors.companySize && <span className="text-xs text-red-500">Este campo es obligatorio</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción de la empresa</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows="2"
                      {...register("companyDescription", { required: true, maxLength: 200 })}
                      placeholder="Describe brevemente tu empresa..."
                    />
                    {errors.companyDescription && <span className="text-xs text-red-500">Este campo es obligatorio (máximo 200 caracteres)</span>}
                  </div>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(2)}>Volver</Button>
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