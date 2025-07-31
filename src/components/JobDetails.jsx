import React, { useState, useEffect } from 'react';
import {
  Building,
  MapPin,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { applyToOffer } from "../service/api";
import useAuthStore from "../shared/stores/authStore"; // Asegúrate de que la ruta sea correcta

export default function JobDetails({ job }) {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para el mensaje de error

  // Accede al token desde el store
  const token = useAuthStore(state => state.token);

  // Limpiar el estado de error cuando cambie el job
  useEffect(() => {
    setError(null);
  }, [job]); // Se reinicia cada vez que el `job` cambia

  if (!job) return null;

  const handleAplicar = async () => {
    if (!job._id || !token) return;
    setLoading(true);
    setError(null); // Resetear el error antes de realizar la solicitud

    try {
      // Imprimir en consola el id de la oferta y el token antes de la petición
      console.log(`Aplicando a la oferta con ID: ${job._id}`);
      console.log(`Token enviado: ${token}`);

      const res = await applyToOffer({
        ofertaId: job._id,
        mensajeCandidato: mensaje,
      });

      // Imprimir la respuesta de la API para depurar
      console.log("Respuesta de la API: ", res);

      // Comprobar si la respuesta contiene un error
      if (res.error) {
        // Si el error es verdadero, mostrar el mensaje de "Ya has aplicado a esta oferta"
        setError(res.message);
      } else {
        // Maneja cualquier otro tipo de respuesta exitosa
        console.log("Solicitud enviada con éxito");
      }
    } catch (err) {
      // Manejo de cualquier otro error
      console.error("Error al aplicar a la oferta:", err);
      setError("Hubo un problema al aplicar a la oferta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-[900px] h-[1000px] overflow-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600 mb-4">
            <span className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {job.company}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {job.timePosted}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {job.applicants}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Mostrar alerta de error usando Tailwind CSS */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg border border-red-300">
          <strong>Error: </strong>{error}
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <span className="flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-1" />
          {job.type} • {job.level}
        </span>
        <span className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-1" />
          {job.employees} • Staffing and Recruiting
        </span>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <span className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </span>
      </div>

      <div className="flex space-x-4 mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold shadow-md transition duration-150 flex items-center">
              Aplicar ahora ya
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border border-gray-200 shadow-lg p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                ¿Estás seguro de aplicar?
              </DialogTitle>
              <DialogDescription className="text-gray-600 leading-relaxed">
                Esta acción enviará tu <strong>perfil completo</strong> a la empresa.
                <br />
                <span className="text-blue-600 font-medium">
                  Asegúrate de que tu CV esté actualizado en tu perfil.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <label htmlFor="mensaje-aplicacion" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje para la empresa <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                id="mensaje-aplicacion"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 min-h-[100px] resize-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Escribe un mensaje profesional para presentarte..."
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <button
                  onClick={handleAplicar}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar aplicación"}
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 font-medium flex items-center">
          Guardar empleo
          <Bookmark className="w-4 h-4 ml-2" />
        </button>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sobre el empleo</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {job.description}
        </p>
        {job.responsibilities && (
          <>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Tus responsabilidades incluirán</h3>
            <ul className="space-y-2 text-gray-600">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {responsibility}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
