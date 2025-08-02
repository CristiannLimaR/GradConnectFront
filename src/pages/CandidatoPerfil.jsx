import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Linkedin, Github, FileText, User, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { getUserProfile, getEducationsByUserId, getExperiencesByUserId } from '../service/api';
import { toast } from 'sonner';

export default function CandidatoPerfil() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [candidato, setCandidato] = useState(null);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [educationLoading, setEducationLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('ID de usuario no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        
        if (response.success && response.data.user) {
          setCandidato(response.data.user);
          // Fetch education and experience data for this user
          await Promise.all([
            fetchEducationData(userId),
            fetchExperienceData(userId)
          ]);
        } else {
          setError('No se pudo obtener el perfil del usuario');
          toast.error('Error al cargar el perfil del candidato');
        }
      } catch (error) {
        console.error('Error al obtener perfil del candidato:', error);
        setError('Error al cargar el perfil');
        toast.error('Error al cargar el perfil del candidato');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const fetchEducationData = async (userId) => {
    try {
      setEducationLoading(true);
      const response = await getEducationsByUserId(userId);
      if (response.success) {
        setEducations(response.data.educations || []);
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
      // Don't show error toast for education as it's not critical
    } finally {
      setEducationLoading(false);
    }
  };

  const fetchExperienceData = async (userId) => {
    try {
      setExperienceLoading(true);
      const response = await getExperiencesByUserId(userId);
      if (response.success) {
        setExperiences(response.data.experiences || []);
      }
    } catch (error) {
      console.error('Error fetching experience data:', error);
      // Don't show error toast for experience as it's not critical
    } finally {
      setExperienceLoading(false);
    }
  };

  const volverAtras = () => {
    navigate(-1);
  };

  const contactarCandidato = () => {
    // Redirigir al dashboard de la empresa en la sección de mensajes
    // y pasar el ID del candidato para seleccionarlo automáticamente
    navigate(`/empresa-dashboard?seccion=mensajes&candidatoId=${candidato._id || candidato.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando perfil del candidato...</p>
        </div>
      </div>
    );
  }

  if (error || !candidato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No se encontró el perfil del candidato'}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Usar datos directamente del backend
  const nombre = candidato.firstName || 'N/A';
  const apellido = candidato.lastName || 'N/A';
  const nombreCompleto = `${nombre} ${apellido}`;
  console.log(candidato)

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
              {candidato.profilePhoto ? (
                <img src={candidato.profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {nombre} {apellido}
              </h2>
              <p className="text-xl text-gray-600 mb-2">{candidato.location}</p>
              
              {/* Información de contacto */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{candidato.email}</span>
                </div>
                {candidato.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{candidato.phone}</span>
                  </div>
                )}
                {candidato.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{candidato.location}</span>
                  </div>
                )}
              </div>

              {/* Enlaces sociales */}
              <div className="flex gap-3">
                {candidato.linkedinUrl && (
                  <a href={candidato.linkedinUrl.startsWith('http') ? candidato.linkedinUrl : `https://${candidato.linkedinUrl}`} target="_blank" rel="noopener noreferrer">
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
                <span className="font-medium">{candidato.location}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Teléfono</span>
                <span className="font-medium">{candidato.phone}</span>
              </div>
            </div>
          </Card>

          {/* Descripción */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Descripción</h3>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {candidato.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
          </Card>

          {/* Educación */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Educación</h3>
            {educationLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Cargando educación...</p>
              </div>
            ) : educations.length > 0 ? (
              <div className="space-y-6">
                {educations.map((education, index) => (
                  <div key={education._id || index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{education.degree}</h4>
                    <p className="text-gray-700 font-medium">{education.institution}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {education.startDate ? new Date(education.startDate).getFullYear() : 'N/A'} - 
                          {education.endDate ? new Date(education.endDate).getFullYear() : 'Presente'}
                        </span>
                      </div>
                    </div>
                    {education.description && (
                      <p className="text-gray-600 text-sm mt-2">{education.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay información educativa registrada</p>
              </div>
            )}
          </Card>

          {/* Experiencia */}
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-6">Experiencia</h3>
            {experienceLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Cargando experiencia...</p>
              </div>
            ) : experiences.length > 0 ? (
              <div className="space-y-6">
                {experiences.map((experience, index) => (
                  <div key={experience._id || experience.id || index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{experience.title}</h4>
                    <p className="text-gray-700 font-medium">{experience.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {experience.startDate ? new Date(experience.startDate).getFullYear() : 'N/A'} - 
                          {experience.isCurrent ? 'Presente' : (experience.endDate ? new Date(experience.endDate).getFullYear() : 'N/A')}
                        </span>
                      </div>
                    </div>
                    {experience.description && (
                      <p className="text-gray-600 text-sm mt-2">{experience.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay información de experiencia registrada</p>
              </div>
            )}
          </Card>

          {/* Habilidades técnicas */}
          <Card className="p-8 xl:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Habilidades técnicas</h3>
            <div className="flex flex-wrap gap-3">
              {candidato.skills && candidato.skills.length > 0 ? (
                candidato.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    {skill.skillId?.nameSkill || skill.nameSkill || 'Skill'}
                    {skill.levelSkill && ` (${skill.levelSkill})`}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No hay habilidades registradas</p>
              )}
            </div>
          </Card>

          {/* Enlaces y documentos */}
          <Card className="p-8 xl:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">Enlaces y documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidato.linkedinUrl && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <a 
                    href={candidato.linkedinUrl.startsWith('http') ? candidato.linkedinUrl : `https://${candidato.linkedinUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {candidato.github && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Github className="w-5 h-5 text-gray-600" />
                  <a 
                    href={candidato.github.startsWith('http') ? candidato.github : `https://${candidato.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:underline font-medium"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {candidato.cvAdjunto && (
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <a 
                    href={candidato.cvAdjunto} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-600 hover:underline font-medium"
                  >
                    Ver CV
                  </a>
                </div>
              )}
            </div>
            {!candidato.linkedinUrl && !candidato.github && !candidato.cvAdjunto && (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay enlaces o documentos disponibles</p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
} 