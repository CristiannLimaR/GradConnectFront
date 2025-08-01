import { useEffect, useState } from "react";
import useAuthStore from "../shared/stores/authStore";
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import ProfileProgressBar from "../components/UserProfile/ProfileProgressBar";
import ExperienceSection from "../components/UserProfile/ExperienceSection";
import EducationSection from "../components/UserProfile/EducationSection";
import SkillsSection from "../components/UserProfile/SkillsSection";
import ProfileSummary from "../components/UserProfile/ProfileSummary";
import { useSkills } from "../shared/hooks/useSkills";
import { useExperience } from "../shared/hooks/useExperience";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { BadgeCheck, GraduationCap, Briefcase, Star, UserCog } from "lucide-react";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.updateUser);
  console.log(user);

  // Hooks personalizados
  const { loading: skillsLoading, fetchSkills, addSkill, removeSkill } = useSkills();
  const { 
    loading: experienceLoading, 
    experiences, 
    fetchExperiences, 
    addExperience, 
    updateExperienceById, 
    removeExperience 
  } = useExperience();

  const [showCVDialog, setShowCVDialog] = useState(false);
  const [profile, setProfile] = useState({});
  const [expForm, setExpForm] = useState({
    puesto: "",
    empresa: "",
    desde: "",
    hasta: "",
    descripcion: "",
    isCurrent: false,
    _id: null,
  });
  const [editExpIdx, setEditExpIdx] = useState(null);
  const [error, setError] = useState(null);

  // Estados locales para educación
  const [editEduIdx, setEditEduIdx] = useState(null);
  const [eduForm, setEduForm] = useState({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' });
  const [educacion, setEducacion] = useState([]);

  // Estados y handlers para habilidades
  const [editHabilidades, setEditHabilidades] = useState(false);
  const [habilidadInput, setHabilidadInput] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  const [nivelInput, setNivelInput] = useState("BEGINNER");

  useEffect(() => {
    if (user) {
      setProfile({
        nombre: user.firstName,
        apellido: user.lastName,
        email: user.email,
        ubicacion: user.location,
        telefono: user.phone,
        foto: user.profilePhoto,
        cv: user.cvAdjunto,
        github: user.github,
        linkedin: user.linkedinUrl || user.linkedin,
        descripcion: user.summary || user.description,
      });
      setEducacion(user.educacion || []);
      setHabilidades(user.habilidades || []);
    }
  }, [user]);

  useEffect(() => {
    const loadExperiences = async () => {
      if (!user) return;
      await fetchExperiences();
    };

    loadExperiences();
  }, [user]);

  useEffect(() => {
    const loadSkills = async () => {
      if (user?._id) {
        const skills = await fetchSkills(user._id);
        if (skills) {
          setAuthUser({ ...user, habilidades: skills });
        }
      }
    };
    loadSkills();
  }, [user?._id]);

  const porcentaje = 0;

  const refreshProfile = (updatedUser) => {
    setProfile({
      nombre: updatedUser.firstName,
      apellido: updatedUser.lastName,
      email: updatedUser.email,
      ubicacion: updatedUser.location,
      telefono: updatedUser.phone,
      foto: updatedUser.profilePhoto,
      cv: updatedUser.cvAdjunto,
      github: updatedUser.github,
      linkedin: updatedUser.linkedinUrl || updatedUser.linkedin,
      descripcion: updatedUser.summary || updatedUser.description,
    });
    setAuthUser(updatedUser);
  };

  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addExperiencia = async (e) => {
    e.preventDefault();
    setError(null);

    const dataToSend = {
      title: expForm.puesto,
      company: expForm.empresa,
      startDate: expForm.desde,
      endDate: expForm.isCurrent ? null : expForm.hasta,
      description: expForm.descripcion,
      isCurrent: expForm.isCurrent,
    };

    let result;
    if (editExpIdx !== null && editExpIdx !== "new") {
      const experienceId = expForm._id;
      if (!experienceId) {
        setError("ID de experiencia no encontrado.");
        return;
      }
      result = await updateExperienceById(experienceId, dataToSend);
    } else {
      result = await addExperience(dataToSend);
    }

    if (result) {
      // Actualizar el usuario con las experiencias del estado local del hook
      const updatedUser = {
        ...user,
        experiencia: experiences,
      };
      refreshProfile(updatedUser);
      
      setEditExpIdx(null);
      setExpForm({
        puesto: "",
        empresa: "",
        desde: "",
        hasta: "",
        descripcion: "",
        isCurrent: false,
        _id: null,
      });
    }
  };

  const deleteExperiencia = async (experienceId) => {
    setError(null);
    const success = await removeExperience(experienceId);
    if (success) {
      // Actualizar el usuario con las experiencias del estado local del hook
      const updatedUser = {
        ...user,
        experiencia: experiences,
      };
      refreshProfile(updatedUser);
    }
  };

  // Funciones para educación
  const addEducacion = () => {};
  const deleteEducacion = () => {};
  const handleEduChange = () => {};

  // Funciones para habilidades
  const addHabilidad = async (e) => {
    e.preventDefault();
    if (!habilidadInput.trim()) return;
    
    const skillData = {
      nameSkill: habilidadInput,
      levelSkill: nivelInput,
      userId: user._id,
    };
    
    const result = await addSkill(skillData);
    if (result) {
      setAuthUser({
        ...user,
        habilidades: [...(user.habilidades || []), result],
      });
      setHabilidadInput("");
      setNivelInput("BEGINNER");
    }
  };

  const deleteHabilidad = async (idx) => {
    const skillId = user.habilidades[idx]._id;
    const success = await removeSkill(skillId);
    if (success) {
      setAuthUser({
        ...user,
        habilidades: user.habilidades.filter((_, i) => i !== idx),
      });
    }
  };

  const loading = skillsLoading || experienceLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-2 md:px-8 lg:px-0">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Cabecera de perfil en Card */}
        <Card className="w-full animate-fade-in shadow-lg border-none bg-card/90">
          <CardContent className="py-8">
            <ProfileHeader profile={profile} showCVDialog={showCVDialog} setShowCVDialog={setShowCVDialog} />
          </CardContent>
        </Card>
        {/* Barra de progreso */}
        <div className="w-full">
          <ProfileProgressBar porcentaje={porcentaje} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda: Resumen y Educación */}
          <div className="flex flex-col gap-8">
            {/* Resumen */}
            <Card className="w-full animate-fade-in shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <UserCog className="text-primary" />
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <ProfileSummary profile={profile} refreshProfile={refreshProfile} />
              </CardContent>
            </Card>
            {/* Educación */}
            <Card className="w-full animate-fade-in shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <GraduationCap className="text-primary" />
                <CardTitle className="text-lg">Educación</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <EducationSection
                  educacion={educacion}
                  eduForm={eduForm}
                  editEduIdx={editEduIdx}
                  setEditEduIdx={setEditEduIdx}
                  setEduForm={setEduForm}
                  addEducacion={addEducacion}
                  deleteEducacion={deleteEducacion}
                  handleEduChange={handleEduChange}
                />
              </CardContent>
            </Card>
          </div>
          {/* Columna derecha: Experiencia y Habilidades */}
          <div className="flex flex-col gap-8">
            {/* Experiencia */}
            <Card className="w-full animate-fade-in shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Briefcase className="text-primary" />
                <CardTitle className="text-lg">Experiencia</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <ExperienceSection
                  experiencia={experiences}
                  expForm={expForm}
                  editExpIdx={editExpIdx}
                  setEditExpIdx={setEditExpIdx}
                  setExpForm={setExpForm}
                  addExperiencia={addExperiencia}
                  deleteExperiencia={deleteExperiencia}
                  handleExpChange={handleExpChange}
                />
              </CardContent>
            </Card>
            {/* Habilidades */}
            <Card className="w-full animate-fade-in shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Star className="text-primary" />
                <CardTitle className="text-lg">Habilidades</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <SkillsSection
                  habilidades={habilidades}
                  editHabilidades={editHabilidades}
                  setEditHabilidades={setEditHabilidades}
                  habilidadInput={habilidadInput}
                  setHabilidadInput={setHabilidadInput}
                  nivelInput={nivelInput}
                  setNivelInput={setNivelInput}
                  addHabilidad={addHabilidad}
                  deleteHabilidad={deleteHabilidad}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Mensajes de carga y error */}
        {loading && <p className="text-blue-500 animate-pulse text-center">Cargando...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}