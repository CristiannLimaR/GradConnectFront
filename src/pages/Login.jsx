import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useLogin from "../shared/hooks/useLogin";
import useAuthStore from "../shared/stores/authStore";
import { toast } from "sonner";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useLogin();
  const getUser = useAuthStore((state) => state.getUser);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const loginResult = await login(data);
      
      // Solo redirigir si el login fue exitoso
      if (loginResult && loginResult.success !== false) {
        const user = getUser();
        
        // Redirigir según el rol del usuario
        switch (user?.role) {
          case "CANDIDATE":
            if (!user.profilePhoto || !user.cvAdjunto) {
              toast("Completa tu perfil", {
                description: "Por favor, sube tu CV y una foto de perfil esto te dara mas oportunidades de empleo",
                duration: 3000,
              });
              navigate("/user-profile");
            } else {
              navigate("/"); // Página de jobs
            }
            break;
            
          case "RECRUITER":
            navigate("/empresa-dashboard");
            break;
            
          case "GRADCONNECT":
            navigate("/admin");
            break;
            
          default:
            navigate("/");
            break;
        }
      }
      // Si el login falla, no hacer nada (el hook useLogin ya maneja los errores)
    } catch (error) {
      // El error ya es manejado por el hook useLogin, no necesitamos hacer nada aquí
      console.error("Error en login:", error);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Redirigir a login con ${provider}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                {...register("email", { required: "El correo es obligatorio" })}
                autoFocus
              />
              {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                {...register("password", { required: "La contraseña es obligatoria" })}
              />
              {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
            </div>
            <Button className="w-full" type="submit">Entrar</Button>
          </form>
          <div className="my-6 flex items-center justify-center">
            <span className="text-gray-400 text-sm">o continúa con</span>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
              type="button"
              onClick={() => handleSocialLogin("github")}
            >
              <FaGithub className="w-5 h-5" /> Iniciar sesión con GitHub
            </Button>
            <Button
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white hover:bg-blue-800"
              type="button"
              onClick={() => handleSocialLogin("linkedin")}
            >
              <FaLinkedin className="w-5 h-5" /> Iniciar sesión con LinkedIn
            </Button>
            <Button
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
              type="button"
              onClick={() => handleSocialLogin("google")}
            >
              <FaGoogle className="w-5 h-5" /> Iniciar sesión con Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          <span className="text-sm">¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link></span>
        </CardFooter>
      </Card>
    </div>
  );
} 