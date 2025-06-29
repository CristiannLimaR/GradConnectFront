import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Linkedin, Github, FileText, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function CandidatoPerfil() {
  const navigate = useNavigate();
  const [candidato, setCandidato] = useState(null);

  useEffect(() => {
    // Obtener los datos del candidato desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const candidatoData = urlParams.get('data');
    
    if (candidatoData) {
      try {
        const candidatoDecoded = JSON.parse(decodeURIComponent(candidatoData));
        setCandidato(candidatoDecoded);
      } catch (error) {
        console.error('Error al decodificar datos del candidato:', error);
      }
    }
  }, []);

  const volverAtras = () => {
    navigate(-1);
  };

  const contactarCandidato = () => {
    // Redirigir al dashboard de la empresa en la sección de mensajes
    // y pasar los datos del candidato para seleccionarlo automáticamente
    const candidatoData = encodeURIComponent(JSON.stringify(candidato));
    navigate(`/empresa-dashboard?seccion=mensajes&candidato=${candidatoData}`);
  };

  if (!candidato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando perfil del candidato...</p>
        </div>
      </div>
    );
  }

  // Separar nombre y apellido
  const nombreCompleto = candidato.nombre.split(' ');
  const nombre = nombreCompleto[0] || '';
  const apellido = nombreCompleto.slice(1).join(' ') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={volverAtras}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Perfil del candidato</h1>
            </div>
            <div className="flex gap-3">
              <Button onClick={contactarCandidato}>
                <Mail className="w-4 h-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del candidato */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start gap-8">
            {/* Foto de perfil */}
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 overflow-hidden border-4 border-blue-200">
              {candidato.foto ? (
                <img src={candidato.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {nombre} {apellido}
              </h2>
              <p className="text-xl text-gray-600 mb-2">{candidato.ubicacion}</p>
              <p className="text-lg text-gray-500 mb-4">{candidato.experiencia} de experiencia</p>
              
              {/* Información de contacto */}
              <div className="flex flex-wrap gap-3 mb-4">
                <Button variant="outline" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  {candidato.email}
                </Button>
                <Button variant="outline" size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  {candidato.telefono}
                </Button>
              </div>

              {/* Enlaces sociales */}
              <div className="flex gap-3">
                {candidato.linkedin && (
                  <a href={`https://${candidato.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </a>
                )}
                {candidato.github && (
                  <a href={`https://${candidato.github}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </a>
                )}
                {candidato.cv && (
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    {candidato.cv}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Información personal */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Información personal</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Nombre</span>
                <span className="font-medium">{nombre}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Apellido</span>
                <span className="font-medium">{apellido}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="font-medium">{candidato.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Ubicación</span>
                <span className="font-medium">{candidato.ubicacion}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Teléfono</span>
                <span className="font-medium">{candidato.telefono}</span>
              </div>
            </div>
          </Card>

          {/* Descripción */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Descripción</h3>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {candidato.descripcion || candidato.mensaje || 'Sin descripción disponible'}
              </p>
            </div>
          </Card>

          {/* Educación */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Educación</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{candidato.educacion}</h4>
                <p className="text-gray-600 text-sm">Formación académica</p>
              </div>
            </div>
          </Card>

          {/* Experiencia */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Experiencia</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">Desarrollador de Software</h4>
                <p className="text-gray-600">{candidato.experiencia} de experiencia</p>
                <p className="text-gray-500 text-sm">Desarrollo de aplicaciones web y móviles</p>
              </div>
            </div>
          </Card>

          {/* Habilidades técnicas */}
          <Card className="p-8 xl:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Habilidades técnicas</h3>
            <div className="flex flex-wrap gap-3">
              {candidato.habilidades.map((habilidad, index) => (
                <span key={index} className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  {habilidad}
                </span>
              ))}
            </div>
          </Card>

          {/* Enlaces y documentos */}
          <Card className="p-8 xl:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Enlaces y documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidato.linkedin && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <a href={`https://${candidato.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    LinkedIn
                  </a>
                </div>
              )}
              {candidato.github && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Github className="w-5 h-5 text-gray-600" />
                  <a href={`https://${candidato.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline font-medium">
                    GitHub
                  </a>
                </div>
              )}
              {candidato.cv && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <a href="#" className="text-orange-600 hover:underline font-medium">
                    {candidato.cv}
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
} 