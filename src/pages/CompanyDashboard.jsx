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
  Linkedin,
  Github,
  Hand,
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
import { toast } from "sonner";

const SECCIONES = [
  { key: "perfil", label: "Perfil de la empresa" },
  { key: "ofertas", label: "Ofertas de trabajo" },
  { key: "mensajes", label: "Mensajes" },
];

export default function CompanyDashboard() {
  const { getOffersByEnterprise, saveOffer, editOffer, deleteOffer } =
    useOffer();
  const { user } = useAuthStore();
  const { getEnterpriseByRecruiter } = useEnterprise();

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

  // ############## FAKE DATA ##############
  // Simulación de datos de empresa y ofertas (solo para visualización, no para enviar al backend)
  const empresa = {
    nombre: "Mi Empresa",
    descripcion: "Descripción de la empresa...",
    email: "empresa@email.com",
    ubicacion: "Madrid",
    telefono: "+34 600 000 000",
    foto: "",
    linkedin: "",
    github: "",
    cv: null,
  };

  const candidatos = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "+34 600 111 111",
      descripcion: "Desarrollador con experiencia...",
      mensaje:
        "Me interesa mucho esta posición. Tengo 3 años de experiencia en React y Node.js.",
      fecha: "Hace 2 días",
      ofertaId: 1,
      // Información adicional del perfil
      edad: 28,
      ubicacion: "Madrid, España",
      experiencia: "3 años",
      educacion: "Ingeniería Informática - Universidad Complutense",
      habilidades: [
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "MongoDB",
        "PostgreSQL",
      ],
      idiomas: ["Español (Nativo)", "Inglés (Avanzado)"],
      linkedin: "linkedin.com/in/juanperez",
      github: "github.com/juanperez",
      portfolio: "juanperez.dev",
      cv: "CV_Juan_Perez.pdf",
      estadoCivil: "Soltero",
      disponibilidad: "Inmediata",
      expectativaSalarial: "€35,000 - €45,000",
      preferencias: ["Remoto", "Flexibilidad horaria", "Proyectos innovadores"],
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@email.com",
      telefono: "+34 600 222 222",
      descripcion: "Desarrolladora frontend...",
      mensaje:
        "Perfecto para mi perfil. He trabajado con las tecnologías que mencionan.",
      fecha: "Hace 1 día",
      ofertaId: 1,
      // Información adicional del perfil
      edad: 25,
      ubicacion: "Barcelona, España",
      experiencia: "2 años",
      educacion:
        "Grado en Desarrollo de Aplicaciones Web - Universitat Pompeu Fabra",
      habilidades: ["React", "Vue.js", "CSS", "Sass", "JavaScript", "Git"],
      idiomas: ["Español (Nativo)", "Inglés (Intermedio)", "Catalán (Nativo)"],
      linkedin: "linkedin.com/in/mariagarcia",
      github: "github.com/mariagarcia",
      portfolio: "mariagarcia.com",
      cv: "CV_Maria_Garcia.pdf",
      estadoCivil: "Casada",
      disponibilidad: "2 semanas",
      expectativaSalarial: "€30,000 - €40,000",
      preferencias: ["Híbrido", "Horario flexible", "Equipo joven"],
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos@email.com",
      telefono: "+34 600 333 333",
      descripcion: "Desarrollador backend...",
      mensaje:
        "Me encantaría formar parte del equipo. Tengo experiencia en Python y Django.",
      fecha: "Hace 3 días",
      ofertaId: 2,
      // Información adicional del perfil
      edad: 32,
      ubicacion: "Valencia, España",
      experiencia: "5 años",
      educacion: "Ingeniería de Sistemas - Universidad Politécnica de Valencia",
      habilidades: ["Python", "Django", "Flask", "PostgreSQL", "Docker", "AWS"],
      idiomas: ["Español (Nativo)", "Inglés (Avanzado)", "Valenciano (Básico)"],
      linkedin: "linkedin.com/in/carloslopez",
      github: "github.com/carloslopez",
      portfolio: "carloslopez.tech",
      cv: "CV_Carlos_Lopez.pdf",
      estadoCivil: "Casado",
      disponibilidad: "1 mes",
      expectativaSalarial: "€45,000 - €55,000",
      preferencias: [
        "Presencial",
        "Liderazgo técnico",
        "Arquitectura de software",
      ],
    },
  ];
  const mensajes = [
    {
      id: 1,
      candidato: "Juan Pérez",
      email: "juan@email.com",
      oferta: "Desarrollador Frontend",
      ultimoMensaje:
        "Me interesa mucho esta posición. ¿Podríamos agendar una entrevista?",
      fecha: "Hace 2 horas",
      leido: false,
      conversacion: [
        {
          id: 1,
          autor: "candidato",
          mensaje:
            "Hola, me interesa mucho esta posición. Tengo 3 años de experiencia en React y Node.js.",
          fecha: "Hace 2 días",
        },
        {
          id: 2,
          autor: "empresa",
          mensaje:
            "Hola Juan, gracias por tu interés. ¿Podrías enviarnos tu CV actualizado?",
          fecha: "Hace 1 día",
        },
        {
          id: 3,
          autor: "candidato",
          mensaje:
            "Por supuesto, ya lo he enviado. ¿Podríamos agendar una entrevista?",
          fecha: "Hace 2 horas",
        },
      ],
    },
    {
      id: 2,
      candidato: "María García",
      email: "maria@email.com",
      oferta: "Desarrollador Frontend",
      ultimoMensaje: "Perfecto, estaré disponible el martes a las 10:00 AM.",
      fecha: "Hace 1 día",
      leido: true,
      conversacion: [
        {
          id: 1,
          autor: "candidato",
          mensaje:
            "Perfecto para mi perfil. He trabajado con las tecnologías que mencionan.",
          fecha: "Hace 3 días",
        },
        {
          id: 2,
          autor: "empresa",
          mensaje:
            "Excelente María. ¿Te parece bien el martes a las 10:00 AM para la entrevista?",
          fecha: "Hace 1 día",
        },
        {
          id: 3,
          autor: "candidato",
          mensaje: "Perfecto, estaré disponible el martes a las 10:00 AM.",
          fecha: "Hace 1 día",
        },
      ],
    },
    {
      id: 3,
      candidato: "Carlos López",
      email: "carlos@email.com",
      oferta: "Desarrollador Backend",
      ultimoMensaje: "Gracias por la oportunidad. Espero su respuesta.",
      fecha: "Hace 3 días",
      leido: true,
      conversacion: [
        {
          id: 1,
          autor: "candidato",
          mensaje:
            "Me encantaría formar parte del equipo. Tengo experiencia en Python y Django.",
          fecha: "Hace 5 días",
        },
        {
          id: 2,
          autor: "empresa",
          mensaje:
            "Hola Carlos, gracias por tu aplicación. Revisaremos tu perfil y te contactaremos pronto.",
          fecha: "Hace 3 días",
        },
        {
          id: 3,
          autor: "candidato",
          mensaje: "Gracias por la oportunidad. Espero su respuesta.",
          fecha: "Hace 3 días",
        },
      ],
    },
  ];

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

  // Cálculo de estadísticas
  const estadisticas = {
    totalOfertas: offers.length,
    totalCandidatos: candidatos.length,
    mensajesNoLeidos: mensajes.filter((m) => !m.leido).length,
    ofertasActivas: offers.filter(
      (o) => o.timePosted?.includes("día") || o.timePosted?.includes("hora")
    ).length,
    candidatosRecientes: candidatos.filter((c) => c.fecha.includes("día"))
      .length,
    tasaRespuesta: Math.round((mensajes.length / candidatos.length) * 100) || 0,
  };

  // Datos para el chart de candidatos por oferta
  const chartData = offers.map((offer) => ({
    oferta: offer.title,
    candidatos: candidatos.filter((c) => c.ofertaId === offer.id).length,
  }));

  const mostrarCandidatos = (ofertaId) => {
    const candidatosFiltrados = candidatos.filter(
      (c) => c.ofertaId === ofertaId
    );
    setCandidatosOferta(candidatosFiltrados);
    setCandidatosDialog(true);
  };

  const abrirFormularioEdicion = (oferta) => {
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
      skills: oferta.skills || [],
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
      skills: formOferta.skills.filter((s) => s !== skill),
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
    // Redirigir a una nueva página con los datos del candidato
    const candidatoData = encodeURIComponent(JSON.stringify(candidato));
    navigate(`/candidato-perfil?data=${candidatoData}`);
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
                        Tasa de Respuesta
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {estadisticas.tasaRespuesta}%
                      </p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <FileText className="w-3 h-3 mr-1" />
                        Conversaciones activas
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
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

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Promedio Salarial
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        €37,500
                      </p>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Rango promedio
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
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
                            {enterprise?.name || empresa.nombre}
                          </h2>
                          <p className="text-gray-600">
                            {enterprise?.description || empresa.descripcion}
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
                                {enterprise?.email || empresa.email}
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
                                {enterprise?.contactNumber || empresa.telefono}
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
                              <p className="text-gray-900">
                                {enterprise?.address || empresa.ubicacion}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Linkedin className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                LinkedIn
                              </p>
                              <p className="text-gray-900">
                                {enterprise?.socialMediaLinks?.find((link) =>
                                  link.includes("linkedin")
                                ) ||
                                  empresa.linkedin ||
                                  "No especificado"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Github className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                GitHub
                              </p>
                              <p className="text-gray-900">
                                {enterprise?.socialMediaLinks?.find((link) =>
                                  link.includes("github")
                                ) ||
                                  empresa.github ||
                                  "No especificado"}
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
                                {enterprise?.webSite || "www.miempresa.com"}
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
                      <form className="space-y-4">
                        <div>
                          <Label>Nombre de la empresa</Label>
                          <Input
                            type="text"
                            placeholder="Nombre de la empresa"
                            defaultValue={enterprise?.name || empresa.nombre}
                          />
                        </div>
                        <div>
                          <Label>Descripción</Label>
                          <Textarea
                            placeholder="Describe tu empresa..."
                            defaultValue={
                              enterprise?.description || empresa.descripcion
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              placeholder="Correo de contacto"
                              defaultValue={enterprise?.email || empresa.email}
                            />
                          </div>
                          <div>
                            <Label>Teléfono</Label>
                            <Input
                              type="tel"
                              placeholder="Teléfono"
                              defaultValue={
                                enterprise?.contactNumber || empresa.telefono
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Ubicación</Label>
                          <Input
                            type="text"
                            placeholder="Ubicación"
                            defaultValue={
                              enterprise?.address || empresa.ubicacion
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>LinkedIn</Label>
                            <Input
                              type="url"
                              placeholder="Enlace a LinkedIn"
                              defaultValue={
                                enterprise?.socialMediaLinks?.find((link) =>
                                  link.includes("linkedin")
                                ) || empresa.linkedin
                              }
                            />
                          </div>
                          <div>
                            <Label>GitHub</Label>
                            <Input
                              type="url"
                              placeholder="Enlace a GitHub"
                              defaultValue={
                                enterprise?.socialMediaLinks?.find((link) =>
                                  link.includes("github")
                                ) || empresa.github
                              }
                            />
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
                      <span className="font-medium">
                        {enterprise?.createdAt
                          ? new Date(enterprise.createdAt).getFullYear()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamaño</span>
                      <span className="font-medium">
                        {enterprise?.size || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industria</span>
                      <span className="font-medium">
                        {enterprise?.industry || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo</span>
                      <span className="font-medium">
                        {enterprise?.type || "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Actividad reciente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nueva oferta publicada
                        </p>
                        <p className="text-xs text-gray-600">Hace 1 día</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          5 candidatos aplicaron
                        </p>
                        <p className="text-xs text-gray-600">Hace 2 días</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Entrevista programada
                        </p>
                        <p className="text-xs text-gray-600">Hace 3 días</p>
                      </div>
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
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {oferta.timePosted}
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
                              oferta.modality === "Tiempo Completo"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {oferta.modality}
                          </span>
                          {oferta.location === "Remoto" && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                      <Label className="mb-2">Habilidades técnicas</Label>
                      <div>
                        <Label className="mb-2">
                          Seleccionar habilidades técnicas
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {allSkills.map((skill) => (
                            <button
                              key={skill._id}
                              type="button"
                              className={`px-3 py-1 rounded-full text-sm border ${
                                formOferta.skills.includes(skill._id)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                              onClick={() => {
                                if (!formOferta.skills.includes(skill._id)) {
                                  setFormOferta({
                                    ...formOferta,
                                    skills: [...formOferta.skills, skill._id],
                                  });
                                }
                              }}
                            >
                              {skill.nameSkill}
                            </button>
                          ))}
                        </div>

                        {/* Muestra las skills seleccionadas con opción de eliminar */}
                        {formOferta.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formOferta.skills.map((skillId) => {
                              const skill = allSkills.find(
                                (s) => s._id === skillId
                              );
                              return (
                                <div
                                  key={skillId}
                                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                  <span>
                                    {skill?.nameSkill || "Skill desconocida"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => eliminarSkill(skillId)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
            <h2 className="text-2xl font-bold mb-6">Mensajes de candidatos</h2>
            <div className="flex gap-6">
              {/* Lista de conversaciones */}
              <div className="w-80 bg-white rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Conversaciones</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {mensajes.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      onClick={() => setConversacionSeleccionada(mensaje)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        conversacionSeleccionada?.id === mensaje.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {mensaje.candidato}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {mensaje.oferta}
                          </p>
                        </div>
                        {!mensaje.leido && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {mensaje.ultimoMensaje}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {mensaje.fecha}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversación seleccionada */}
              <div className="flex-1 bg-white rounded-lg border">
                {conversacionSeleccionada ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {conversacionSeleccionada.candidato}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {conversacionSeleccionada.oferta}
                          </p>
                          <p className="text-xs text-gray-500">
                            {conversacionSeleccionada.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Llamar
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="h-[500px] overflow-y-auto p-4">
                      <div className="space-y-4">
                        {conversacionSeleccionada.conversacion.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.autor === "empresa"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.autor === "empresa"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{msg.mensaje}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.autor === "empresa"
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {msg.fecha}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          className="flex-1"
                          rows={2}
                        />
                        <Button>Enviar</Button>
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
    </div>
  );
}
