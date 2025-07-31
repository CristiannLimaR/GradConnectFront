import axios from 'axios';
import { Briefcase, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuthStore from '../shared/stores/authStore';

export default function AppliedSavedJobs() {
  const { token } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    if (!token) {
      console.log("Token no disponible.");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/gradconnect/v1/solicitudes/`,
          {
            headers: { 'x-token': token },
          }
        );

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formattedJobs = res.data.map((app) => {
            const offer = app.ofertaId; 
            return {
              id: offer.id,
              title: offer.title,
              company: offer.company,
              location: offer.ubication,
              salary: offer.salary,
              description: offer.description,
              modality: offer.modality,
              status: app.estado,
              datePosted: offer.createdAt,
              closingDate: offer.closingDate,
              requirements: offer.requirements,
            };
          });

          setJobs(formattedJobs);
        }
      } catch (err) {
        console.error("Error al obtener postulaciones:", err);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Trabajos Aplicados</h1>
        
        {/* Sección de trabajos aplicados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                </div>
                
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500 mb-4">{job.location}</p>
                
                <p className="text-gray-700 text-sm mb-4">{job.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Salario: ${job.salary}</span>
                  <span
                    className={`${
                      job.status === 'pendiente' ? 'bg-yellow-200' : 'bg-green-200'
                    } px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-4 text-gray-500 text-sm">
                  <span><Calendar className="inline mr-2" />Cierra el: {new Date(job.closingDate).toLocaleDateString()}</span>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800">Requisitos:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-gray-600 text-sm flex items-center">
                        <Briefcase className="inline mr-2 text-sm text-gray-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No se han encontrado trabajos aplicados.</p>
          )}
        </div>

        {/* Nueva sección para "Trabajos Guardados" */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Trabajos Guardados</h2>
          <p className="text-gray-600 mt-2">Aquí puedes ver los trabajos que has guardado para consultar más tarde.</p>
          
          {/* Aquí podrías agregar una lista de trabajos guardados, si los tienes */}
          {/* Este es un ejemplo de cómo podrías mostrar los trabajos guardados */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">No tienes trabajos guardados aún.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
