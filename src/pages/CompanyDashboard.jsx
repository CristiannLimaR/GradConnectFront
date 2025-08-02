import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Eye,
  Edit,
  Users,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  Mail,
  Phone,
  Plus,
  Trash2,
  X,
  TrendingUp,
  Briefcase,
  FileText,
  Bell,
  Globe,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Link2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useOffer } from "../shared/hooks/useWOffer";
import { useEnterprise } from "../shared/hooks/useEnterprise";
import { useSkills } from "../shared/hooks/useSkills.js";
import useAuthStore from "../shared/stores/authStore.js";
import useMessages from "../shared/hooks/useMessages.js";
import { toast } from "sonner";
import JobSkillSelector from "../components/JobSkillSelector";
import { getCompanyDashboardStats } from "../service/api";

const SECCIONES = [
  { key: "perfil", label: "Perfil de la empresa" },
  { key: "ofertas", label: "Ofertas de trabajo" },
  { key: "mensajes", label: "Mensajes" },
];

export default function CompanyDashboard() {
  // Function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { getOffersByEnterprise, saveOffer, editOffer, deleteOffer } =
    useOffer();

  // Function to close/open job offer
  const cerrarOferta = async (offerId, currentStatus) => {
    try {
      // Backend uses Boolean: true = active/open, false = closed
      const newStatus = currentStatus ? false : true;
      const success = await editOffer(offerId, { status: newStatus });
      if (success && !success.error) {
        toast.success(`Oferta ${newStatus ? 'abierta' : 'cerrada'} exitosamente`);
        // Reload offers
        const updated = await getOffersByEnterprise(enterprise.id);
        if (updated && updated.offers) {
          setOffers(updated.offers);
        }
      } else {
        toast.error('Error al actualizar el estado de la oferta');
      }
    } catch (error) {
      toast.error('Error al actualizar el estado de la oferta');
    }
  };
  const { user } = useAuthStore();
  const { getEnterpriseByRecruiter, updateEnterprise } = useEnterprise();
  
  // Messaging functionality
  const {
    conversations,
    currentConversation,
    messages,
    loading: messagesLoading,
    sending,
    isConnected,
    selectConversation,
    sendMessage,
    startConversation,
    handleStartTyping,
    handleStopTyping
  } = useMessages();
  
  const [offers, setOffers] = useState([]);
  const [enterprise, setEnterprise] = useState(null);

  const [allSkills, setAllSkills] = useState([]);
  const { getAllSkills, getSkillById } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [seccion, setSeccion] = useState("perfil");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [creandoOferta, setCreandoOferta] = useState(false);
  const [editandoOferta, setEditandoOferta] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [candidatosDialog, setCandidatosDialog] = useState(false);
  const [candidatosOferta, setCandidatosOferta] = useState([]);
  const [conversacionSeleccionada, setConversacionSeleccionada] =
    useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [contactDialog, setContactDialog] = useState(false);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [mensajeInicial, setMensajeInicial] = useState("");
  const [formOferta, setFormOferta] = useState({
    title: "",
    description: "",
    enterprise: "", // Se llenará con el ID de la empresa real
    location: "",
    modality: "",
    salary: "",
    ubication: "",
    requirements: "",
    closingDate: "",
    skills: [],
  });

  

  const [nuevaSkill, setNuevaSkill] = useState("");
  const [candidatos, setCandidatos] = useState([]);
  const [mensajes, setMensajes] = useState([]);




  // Estdos OFFERS ////////////////////////////////////////

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !(user._id || user.id)) {
        console.log("user no disponible aún");
        return;
      }

      const recruiterId = user._id || user.id;

      const enterpriseResponse = await getEnterpriseByRecruiter(recruiterId);

      if (enterpriseResponse && enterpriseResponse.enterprise) {
        setEnterprise(enterpriseResponse.enterprise); // Establecer el objeto de empresa

        const offersResponse = await getOffersByEnterprise(
          enterpriseResponse.enterprise.id
        );
        if (offersResponse && offersResponse.offers) {
          setOffers(offersResponse.offers);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const cargarSkills = async () => {
      const response = await getAllSkills();
      if (response && Array.isArray(response)) {
        setAllSkills(response);
      }
    };
    cargarSkills();
  }, []);

  const [formData, setFormData] = useState({
    name: enterprise?.name || "",
    description: enterprise?.description || "",
    email: enterprise?.email || "",
    contactNumber: enterprise?.contactNumber || "",
    address: enterprise?.address || "",
    socialMediaLinks: enterprise?.socialMediaLinks || "",
    webSite: enterprise?.webSite || "",
    size: enterprise?.size || "",
    industry: enterprise?.industry || "",
    type: enterprise?.type || "",
  });

  useEffect(() => {
  if (enterprise) {
    setFormData({
      name: enterprise.name || "",
      description: enterprise.description || "",
      email: enterprise.email || "",
      contactNumber: enterprise.contactNumber || "",
      address: enterprise.address || "",
      socialMediaLinks: enterprise?.socialMediaLinks || "",
      webSite: enterprise.webSite || "",
      size: enterprise?.size || "",
      industry: enterprise?.industry || "",
      type: enterprise?.type || "",
    });
  }
}, [enterprise]);

  // Estado de estadísticas del dashboard
  const [estadisticas, setEstadisticas] = useState({
    totalOfertas: 0,
    totalCandidatos: 0,
    mensajesNoLeidos: 0,
    ofertasActivas: 0,
    candidatosRecientes: 0,
    tasaRespuesta: 0
  });

  // Obtener estadísticas del backend cuando enterprise esté disponible
  useEffect(() => {
    const fetchStats = async () => {
      if (enterprise && (enterprise._id || enterprise.id)) {
        const stats = await getCompanyDashboardStats(enterprise._id || enterprise.id);
        if (stats && !stats.error) {
          setEstadisticas(stats);
        }
      }
    };
    fetchStats();
  }, [enterprise]);


  // Datos para el chart de candidatos por oferta
  const chartData = offers.map((offer) => ({
    oferta: offer.title,
    candidatos: candidatos.filter((c) => c.ofertaId === offer.id).length,
  }));

  const mostrarCandidatos = (ofertaId) => {
    // Encontrar la oferta específica
    const oferta = offers.find(offer => offer.id === ofertaId || offer._id === ofertaId);
    
    if (oferta && oferta.applications) {
      // Extraer candidatos de las aplicaciones
      const candidatosFromApplications = oferta.applications.map(application => ({
        id: application._id,
        nombre: `${application.usuarioId.firstName} ${application.usuarioId.lastName}`,
        email: application.usuarioId.email,
        telefono: application.usuarioId.phone || 'No disponible',
        ubicacion: application.usuarioId.location || 'No especificada',
        descripcion: 'Candidato aplicado a la oferta',
        skills: application.usuarioId.skills || [],
        registrationDate: application.usuarioId.registrationDate,
        ofertaId: ofertaId,
        applicationId: application._id,
        usuarioId: application.usuarioId._id
      }));
      
      setCandidatosOferta(candidatosFromApplications);
    } else {
      setCandidatosOferta([]);
    }
    
    setCandidatosDialog(true);
  };

  const abrirFormularioEdicion = async (oferta) => {
    // Convertir skill IDs a objetos skill completos
    const skillObjects = await Promise.all(
      (oferta.skills || []).map(async (skill) => {
        const skillId = typeof skill === "string" ? skill : skill._id;
        try {
          const skillData = await getSkillById(skillId);
          return skillData || { _id: skillId, nameSkill: "Skill desconocida" };
        } catch (error) {
          console.error("Error loading skill:", skillId, error);
          return { _id: skillId, nameSkill: "Skill desconocida" };
        }
      })
    );

    setFormOferta({
      title: oferta.title,
      description: oferta.description,
      enterprise: oferta.enterprise?._id, // Asegúrate de que sea el ID
      location: oferta.location,
      modality: oferta.modality,
      salary: oferta.salary,
      ubication: oferta.ubication,
      requirements: oferta.requirements.join("\n"), // convertir a string para editar
      closingDate: oferta.closingDate?.substring(0, 10), // YYYY-MM-DD
      skills: skillObjects,
    });
    setEditandoOferta(true);
    setCreandoOferta(false);
    setOfertaSeleccionada(oferta); // Necesario para editOffer
  };

  const abrirFormularioCreacion = () => {
    setFormOferta({
      title: "",
      description: "",
      enterprise: enterprise?._id || "", // Usar el ID de la empresa real
      location: "",
      modality: "",
      salary: "",
      ubication: "",
      requirements: "",
      closingDate: "",
      skills: [],
    });
    setCreandoOferta(true);
    setEditandoOferta(false);
    setOfertaSeleccionada(null); // Asegurarse de que no haya oferta seleccionada al crear
  };

  const eliminarSkill = (skill) => {
    setFormOferta({
      ...formOferta,
      skills: formOferta.skills.filter((s) => s._id !== skill._id),
    });
  };

  const agregarSkill = (skill) => {
    setFormOferta({
      ...formOferta,
      skills: [...formOferta.skills, skill],
    });
  };

  const handleInputChange = (field, value) => {
    setFormOferta({
      ...formOferta,
      [field]: value,
    });
  };

  const handleOpenModal = async (oferta) => {
    console.log("oferta.skills (original):", oferta.skills);

    const resolvedSkills = await Promise.all(
      oferta.skills.map(async (skill) => {
        const skillId = typeof skill === "string" ? skill : skill._id;

        try {
          const resp = await getSkillById(skillId);
          if (resp && resp.nameSkill) {
            return resp.nameSkill;
          } else {
            return skillId; // Fallback
          }
        } catch (e) {
          console.error("Error al obtener skill:", skillId, e);
          return skillId;
        }
      })
    );

    const ofertaConSkillsConNombres = {
      ...oferta,
      skills: resolvedSkills,
    };

    console.log("Skills con nombres resueltos:", resolvedSkills);
    setOfertaSeleccionada(ofertaConSkillsConNombres);
    setIsModalOpen(true);
  };

  const guardarOferta = async () => {
    // Validar que enterprise._id esté disponible
    if (!enterprise?.id) {
      toast.error("Error", {
        description:
          "No se pudo obtener la información de la empresa. Intente recargar la página.",
        duration: 3000,
      });
      return;
    }

    const datos = {
      ...formOferta,
      enterprise: enterprise.id, // Asegurarse de enviar el ID de la empresa
      requirements: formOferta.requirements
        .split("\n")
        .filter((req) => req.trim() !== ""), // Filtrar requisitos vacíos
      salary: Number(formOferta.salary),
      // Extraer solo los IDs de las skills para enviar al backend
      skills: formOferta.skills.map(skill => skill._id || skill),
    };

    delete datos.company;

    const res = editandoOferta
      ? await editOffer(ofertaSeleccionada.id, datos)
      : await saveOffer(datos);

    if (!res.error) {
      toast.success(editandoOferta ? "Oferta actualizada" : "Oferta publicada");
      // Actualizar la lista de ofertas después de guardar/editar
      const updatedOffersResponse = await getOffersByEnterprise(enterprise.id);
      if (updatedOffersResponse && updatedOffersResponse.offers) {
        setOffers(updatedOffersResponse.offers);
      }
    }

    setCreandoOferta(false);
    setEditandoOferta(false);
    setOfertaSeleccionada(null); // Limpiar la oferta seleccionada
  };

  const eliminarOferta = async (id) => {
    try {
      const resp = await deleteOffer(id);
      if (resp.error) {
        const msg = resp.e?.response?.data?.msg || "Error eliminando oferta";
        toast.error(msg);
        return false;
      }
      toast.success("Oferta eliminada");
      return true;
    } catch (error) {
      toast.error("Error inesperado eliminando oferta");
      return false;
    }
  };
  const verPerfilCompleto = (candidato) => {
    // Redirigir a una nueva página con el ID del candidato
    // Los datos se obtendrán mediante API call en la página de destino
    const userId = candidato.usuarioId || candidato.id || candidato._id;
    console.log('Navigating to profile with userId:', userId);
    navigate(`/candidato-perfil/${userId}`);
  };

  // Funciones de mensajería
  const abrirDialogoContacto = (candidato) => {
    setCandidatoSeleccionado(candidato);
    setMensajeInicial("");
    setContactDialog(true);
  };

  const enviarMensajeInicial = async () => {
    if (!candidatoSeleccionado || !mensajeInicial.trim()) {
      toast.error("Por favor, escribe un mensaje");
      return;
    }

    try {
      const userId = candidatoSeleccionado.usuarioId || candidatoSeleccionado.id || candidatoSeleccionado._id;
      const jobOfferId = candidatoSeleccionado.ofertaId;
      
      await startConversation(userId, jobOfferId, mensajeInicial.trim());
      
      setContactDialog(false);
      setCandidatoSeleccionado(null);
      setMensajeInicial("");
      
      // Cambiar a la sección de mensajes
      setSeccion("mensajes");
    } catch (error) {
      console.error('Error sending initial message:', error);
    }
  };

  const enviarMensaje = async () => {
    if (!currentConversation || !nuevoMensaje.trim()) {
      return;
    }

    try {
      await sendMessage(
        currentConversation.otherParticipant.id,
        currentConversation.otherParticipant.type,
        nuevoMensaje.trim(),
        currentConversation.jobOffer?._id
      );
      
      setNuevoMensaje("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  // Efecto para manejar los parámetros de URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const seccionParam = urlParams.get("seccion");
    const candidatoParam = urlParams.get("candidato");

    if (seccionParam) {
      setSeccion(seccionParam);
    }

    if (candidatoParam && seccionParam === "mensajes") {
      try {
        const candidatoData = JSON.parse(decodeURIComponent(candidatoParam));
        // Buscar la conversación correspondiente al candidato
        const conversacion = mensajes.find(
          (m) =>
            m.candidato === candidatoData.nombre ||
            m.email === candidatoData.email
        );
        if (conversacion) {
          setConversacionSeleccionada(conversacion);
        }
      } catch (error) {
        console.error("Error al decodificar datos del candidato:", error);
      }
    }
  }, [location.search]);


  if (!enterprise) {
    console.log("Cargando datos de la empresa...");
    return <div>Cargando datos de la empresa...</div>;
  }

  const fechaLarga = new Date(enterprise.createdAt).toLocaleDateString(
    "en-EN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Menú lateral */}
      <aside className="w-64 bg-white border-r flex flex-col py-8 px-4">
        <h2 className="text-2xl font-bold mb-8 text-blue-700">Panel Empresa</h2>
        <nav className="flex flex-col gap-4">
          {SECCIONES.map((sec) => (
            <Button
              key={sec.key}
              variant={seccion === sec.key ? "default" : "outline"}
              className="justify-start"
              onClick={() => setSeccion(sec.key)}
            >
              {sec.label}
            </Button>
          ))}
        </nav>
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {seccion === "perfil" && (
          <>
            {/* Estadísticas */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Resumen de la empresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Ofertas Activas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {estadisticas.totalOfertas}
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+
                        {estadisticas.ofertasActivas} activas
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Candidatos
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {estadisticas.totalCandidatos}
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+
                        {estadisticas.candidatosRecientes} recientes
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Mensajes No Leídos
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {estadisticas.mensajesNoLeidos}
                      </p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <Bell className="w-3 h-3 mr-1" />
                        Requieren atención
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </Card>


                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Ofertas Remotas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {offers.filter((o) => o.isRemote).length}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        De {estadisticas.totalOfertas} total
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </Card>


              </div>
            </div>

            {/* Chart de candidatos por oferta */}
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Candidatos por oferta
                </h3>
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{item.oferta}</span>
                          <span className="text-gray-600">
                            {item.candidatos} candidatos
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (item.candidatos /
                                  Math.max(
                                    ...chartData.map((d) => d.candidatos)
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Perfil de la empresa */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información principal */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  {!editandoPerfil ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {enterprise.name}
                          </h2>
                          <p className="text-gray-600">
                            {enterprise.description}
                          </p>
                        </div>
                        <Button
                          onClick={() => setEditandoPerfil(true)}
                          variant="outline"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar perfil
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MailIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Email
                              </p>
                              <p className="text-gray-900">
                                {enterprise.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <PhoneIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Teléfono
                              </p>
                              <p className="text-gray-900">
                                {enterprise.contactNumber || "No especificado"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Ubicación
                              </p>
                              <p className="text-gray-900 text truncate overflow-hidden whitespace-nowrap max-w-[200px]">
                                {enterprise.address || "No especificado"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Reclutador 
                              </p>
                              <p className="text-gray-900">
                                {enterprise.recruiters[0].firstName +" "+ enterprise.recruiters[0].lastName || "No especificado" }
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Link2   className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Social Media
                              </p>
                              <p className="text-gray-900 text truncate overflow-hidden whitespace-nowrap max-w-[200px]">
                                {enterprise?.socialMediaLinks[0] || "Sin redes"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Globe className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Sitio web
                              </p>
                              <p className="text-gray-900">
                                {enterprise.webSite}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold">
                          Editar perfil de la empresa
                        </h2>
                        <Button
                          variant="outline"
                          onClick={() => setEditandoPerfil(false)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const result = await updateEnterprise(
                            enterprise.id,
                            formData
                          );
                          const rechargeEnterprise = await getEnterpriseByRecruiter(
                            user._id || user.id
                          );
                          setEnterprise(rechargeEnterprise.enterprise);
                          if (!result.error) {
                            setEditandoPerfil(false); // oculta el formulario si todo salió bien
                          }
                        }}
                      >
                        <div>
                          <Label className="mb-2">Nombre de la empresa</Label>
                          <Input
                            type="text"
                            placeholder="nombre de la empresa"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label className="mb-2">Descripción</Label>
                          <Textarea
                            placeholder="Describe tu empresa..."
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">Email</Label>
                            <Input
                              type="email"
                              placeholder="Correo de contacto"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Teléfono</Label>
                            <Input
                              type="tel"
                              placeholder="Teléfono"
                              value={formData.contactNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  contactNumber: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">Tamaño</Label>
                              <select
                                className="select select-bordered text-white"
                                value={formData.size}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    size: e.target.value,
                                  })
                                }
                              >
                                <option value="">Seleccione un tamaño</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                              </select>
                          </div>
                          <div>
                            <Label className="mb-2">Tipo</Label>
                              <select
                                className="select select-bordered text-white"
                                value={formData.type}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    type: e.target.value,
                                  })
                                }
                              >
                                <option value="">Seleccione un tipo</option>
                                <option value="Startup">Startup</option>
                                <option value="SME">SME</option>
                                <option value="Corporation">Corporation</option>
                                <option value="Non-Profit">Non-Profit</option>
                              </select>
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2">Ubicación</Label>
                          <Input
                            type="text"
                            placeholder="Ubicación"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                      <Label className="mb-2">Redes Sociales *</Label>
                      <Textarea
                        placeholder="Lista de redes sociales"
                        value={formData.socialMediaLinks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialMediaLinks: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">Sitio web</Label>
                            <Input
                              type="url"
                              placeholder="Enlace al sitio web"
                              value={formData.webSite}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  webSite: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="mb-2">Industria</Label>
                              <select
                                className="select select-bordered text-white"
                                value={formData.industry}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    industry: e.target.value,
                                  })
                                }
                              >
                                <option value="">Seleccione una indistria</option>
                                <option value="Technology">Technology</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                                <option value="Finance">Finance</option>
                                <option value="Retail">Retail</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Hospitality">Hospitality</option>
                                <option value="Construction">Construction</option>
                                <option value="Other">Other</option>
                              </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Guardar cambios</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditandoPerfil(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </>
                  )}
                </Card>
              </div>

              {/* Información adicional */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Información de la empresa
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fundada</span>
                      <span className="font-medium">{fechaLarga}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamaño</span>
                      <span className="font-medium">{enterprise.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industria</span>
                      <span className="font-medium">{enterprise.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo</span>
                      <span className="font-medium">{enterprise.type}</span>
                    </div>
                  </div>
                </Card>
                
              </div>
            </div>
          </>
        )}{" "}
        {/*//////////////////////////////////////////////////////////////// OFERTAS DE TRABAJO //////////////////////////////////////////////////////////////// */}
        {seccion === "ofertas" && (
          <div className="max-w-6xl mx-auto">
            {!creandoOferta && !editandoOferta ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Ofertas de trabajo publicadas
                  </h2>
                  <Button onClick={abrirFormularioCreacion}>
                    Crear nueva oferta
                  </Button>
                </div>
                <div className="space-y-4">
                  {offers.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No hay ofertas disponibles.
                    </p>
                  ) : (
                    offers.map((oferta) => (
                      <div
                        key={oferta.id}
                        className="bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {oferta.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {oferta.enterprise?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOfertaSeleccionada(oferta);
                                handleOpenModal(oferta);
                              }}
                              className="text-gray-400 hover:text-blue-600 p-1"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-blue-600 p-1"
                              title="Editar oferta"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirFormularioEdicion(oferta);
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Eliminar oferta"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const confirmed = window.confirm(
                                  "¿Estás seguro de eliminar esta oferta?"
                                );
                                if (!confirmed) return;

                                const success = await eliminarOferta(oferta.id);
                                if (success) {
                                  // Volver a cargar ofertas
                                  const updated = await getOffersByEnterprise(
                                    enterprise.id
                                  );
                                  if (updated && updated.offers) {
                                    setOffers(updated.offers);
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-blue-600 p-1"
                              title="Ver candidatos"
                              onClick={(e) => {
                                e.stopPropagation();
                                mostrarCandidatos(oferta.id);
                              }}
                            >
                              <Users className="w-5 h-5" />
                            </button>
                            <button
                              className={`p-1 ${
                                !oferta.status
                                  ? 'text-gray-400 hover:text-green-600'
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                              title={!oferta.status ? 'Abrir convocatoria' : 'Cerrar convocatoria'}
                              onClick={(e) => {
                                e.stopPropagation();
                                cerrarOferta(oferta.id, oferta.status !== undefined ? oferta.status : true);
                              }}
                            >
                              {!oferta.status ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <X className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(oferta.createdAt)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {oferta.applications?.length || 0}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              oferta.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {oferta.status ? "Abierta" : "Cerrada"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              oferta.modality === "Tiempo Completo"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {oferta.modality}
                          </span>
                          {oferta.location === "Remoto" && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {oferta.ubication}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {oferta.salary}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Modal para mostrar detalles completos */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Detalles de la oferta</DialogTitle>
                    </DialogHeader>
                    {ofertaSeleccionada && (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                              {ofertaSeleccionada.title}
                            </h2>
                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                              <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {ofertaSeleccionada.enterprise?.name}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {ofertaSeleccionada.ubication}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {ofertaSeleccionada.createdAt
                                  ? new Date(
                                      ofertaSeleccionada.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {ofertaSeleccionada.applications?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-gray-600">
                            <Building className="w-4 h-4 mr-1" />
                            {ofertaSeleccionada.modality}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {ofertaSeleccionada.salary}
                          </span>
                        </div>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Descripción del puesto
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {ofertaSeleccionada.description}
                          </p>
                        </div>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Requisitos
                          </h3>
                          <ul className="list-disc list-inside text-gray-600">
                            {ofertaSeleccionada.requirements?.map(
                              (req, index) => (
                                <li key={index}>{req}</li>
                              )
                            )}
                          </ul>
                        </div>
                        {ofertaSeleccionada.skills &&
                          ofertaSeleccionada.skills.length > 0 && (
                            <div className="border-t pt-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Habilidades
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {ofertaSeleccionada.skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOfertaSeleccionada(null); // Cerrar modal de detalles
                              abrirFormularioEdicion(ofertaSeleccionada); // Abrir formulario de edición
                            }}
                          >
                            Editar oferta
                          </Button>
                          <Button
                            onClick={() =>
                              mostrarCandidatos(ofertaSeleccionada.id)
                            }
                          >
                            Ver candidatos
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {/* Modal para mostrar candidatos */}
                <Dialog
                  open={candidatosDialog}
                  onOpenChange={() => setCandidatosDialog(false)}
                >
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Candidatos aplicados</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {candidatosOferta.map((candidato) => (
                        <Card key={candidato.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {candidato.nombre}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {candidato.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                {candidato.telefono}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {candidato.fecha}
                            </span>
                          </div>
                          <div className="mb-3">
                            <h4 className="font-medium text-sm mb-1">
                              Descripción:
                            </h4>
                            <p className="text-sm text-gray-700">
                              {candidato.descripcion}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">
                              Mensaje de aplicación:
                            </h4>
                            <p className="text-sm text-gray-700">
                              {candidato.mensaje}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verPerfilCompleto(candidato)}
                            >
                              Ver perfil completo
                            </Button>
                            <Button size="sm">Contactar</Button>
                          </div>
                        </Card>
                      ))}
                      {candidatosOferta.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay candidatos aplicados a esta oferta</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editandoOferta
                      ? "Editar oferta de trabajo"
                      : "Crear nueva oferta de trabajo"}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreandoOferta(false);
                      setEditandoOferta(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
                <Card className="p-8">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      guardarOferta();
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2">Título del puesto *</Label>
                        <Input
                          type="text"
                          placeholder="Ej: Desarrollador Frontend"
                          value={formOferta.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label className="mb-2">
                          Ubicación (Remoto/Presencial/Híbrido) *
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ej: Presencial, Remoto, Híbrido"
                          value={formOferta.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label className="mb-2">
                          Modalidad (Tiempo Completo/Medio Tiempo) *
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ej: Tiempo Completo, Medio Tiempo"
                          value={formOferta.modality}
                          onChange={(e) =>
                            handleInputChange("modality", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Salario *</Label>
                        <Input
                          type="number"
                          placeholder="Ej: 10000"
                          value={formOferta.salary}
                          onChange={(e) =>
                            handleInputChange("salary", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label className="mb-2">
                          Ciudad/País de la vacante *
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ej: Dubai"
                          value={formOferta.ubication}
                          onChange={(e) =>
                            handleInputChange("ubication", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Fecha de cierre</Label>
                        <Input
                          type="date"
                          value={formOferta.closingDate}
                          onChange={(e) =>
                            handleInputChange("closingDate", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">Descripción del puesto *</Label>
                      <Textarea
                        placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                        value={formOferta.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-2">
                        Requisitos (uno por línea) *
                      </Label>
                      <Textarea
                        placeholder="Lista los requisitos mínimos para el puesto (cada requisito en una nueva línea)..."
                        value={formOferta.requirements}
                        onChange={(e) =>
                          handleInputChange("requirements", e.target.value)
                        }
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <JobSkillSelector
                        selectedSkills={formOferta.skills}
                        onSkillAdded={agregarSkill}
                        onSkillRemoved={eliminarSkill}
                        className=""
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        {editandoOferta
                          ? "Actualizar oferta"
                          : "Publicar oferta"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCreandoOferta(false);
                          setEditandoOferta(false);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}
        {seccion === "mensajes" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mensajes de candidatos</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex gap-6 h-[700px]">
              {/* Lista de conversaciones */}
              <div className="w-1/3 bg-white rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Conversaciones</h3>
                  {messagesLoading && (
                    <div className="text-xs text-gray-500 mt-1">Cargando...</div>
                  )}
                </div>
                <div className="overflow-y-auto h-[600px]">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay conversaciones</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.conversationId}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          currentConversation?.conversationId === conversation.conversationId
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={() => selectConversation(conversation)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{conversation.otherParticipant.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {conversation.jobOffer && (
                          <p className="text-sm text-gray-600 mb-1">
                            {conversation.jobOffer.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-800 truncate">
                          {conversation.lastMessage.isFromMe ? 'Tú: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-xs text-blue-600 font-medium">
                              {conversation.unreadCount} nuevo{conversation.unreadCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Conversación seleccionada */}
              <div className="flex-1 bg-white rounded-lg border">
                {currentConversation ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {currentConversation.otherParticipant.name}
                          </h3>
                          {currentConversation.jobOffer && (
                            <p className="text-sm text-gray-600">
                              {currentConversation.jobOffer.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {currentConversation.otherParticipant.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`mailto:${currentConversation.otherParticipant.email}`, '_blank')}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="h-[500px] overflow-y-auto p-4">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">Cargando mensajes...</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isFromMe = message.sender._id === user.id;
                            return (
                              <div
                                key={message._id}
                                className={`flex ${
                                  isFromMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    isFromMe
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isFromMe
                                        ? "text-blue-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          className="flex-1"
                          rows={2}
                          value={nuevoMensaje}
                          onChange={(e) => setNuevoMensaje(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={sending}
                        />
                        <Button 
                          onClick={enviarMensaje}
                          disabled={sending || !nuevoMensaje.trim()}
                        >
                          {sending ? 'Enviando...' : 'Enviar'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[600px] text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Selecciona una conversación para ver los mensajes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dialog para mostrar candidatos */}
      <Dialog open={candidatosDialog} onOpenChange={setCandidatosDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidatos Aplicados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {candidatosOferta.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay candidatos aplicados a esta oferta</p>
              </div>
            ) : (
              candidatosOferta.map((candidato) => (
                <Card key={candidato.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">{candidato.nombre}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{candidato.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{candidato.telefono}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{candidato.ubicacion}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Fecha de registro:</span>
                            <span className="ml-2 text-gray-600">
                              {candidato.registrationDate ? new Date(candidato.registrationDate).toLocaleDateString() : 'No disponible'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Skills del candidato */}
                      {candidato.skills && candidato.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Habilidades:</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidato.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {skill.skillId || skill.nameSkill || 'Skill'} 
                                {skill.levelSkill && ` (${skill.levelSkill})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verPerfilCompleto(candidato)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Perfil
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoContacto(candidato)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para contactar candidato */}
      <Dialog open={contactDialog} onOpenChange={setContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contactar Candidato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {candidatoSeleccionado && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{candidatoSeleccionado.nombre}</h4>
                <p className="text-sm text-gray-600">{candidatoSeleccionado.email}</p>
              </div>
            )}
            <div>
              <Label className="mb-2">Mensaje inicial</Label>
              <Textarea
                placeholder="Hola, me interesa tu perfil para esta posición..."
                value={mensajeInicial}
                onChange={(e) => setMensajeInicial(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setContactDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={enviarMensajeInicial}
                disabled={sending || !mensajeInicial.trim()}
              >
                {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}