import { useEffect, useState } from "react";
import useAuthStore from "../shared/stores/authStore";
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import ProfileProgressBar from "../components/UserProfile/ProfileProgressBar";
import ExperienceSection from "../components/UserProfile/ExperienceSection";
import EducationSection from "../components/UserProfile/EducationSection";
import SkillsSection from "../components/UserProfile/SkillsSection";
import ProfileSummary from "../components/UserProfile/ProfileSummary";
import { useExperience } from "../shared/hooks/useExperience";
import { useEducation } from "../shared/hooks/useEducation";
import { useSkills } from "../shared/hooks/useSkills";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { BadgeCheck, GraduationCap, Briefcase, Star, UserCog } from "lucide-react";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.updateUser);
  console.log(user);

  // Hooks personalizados
  const { 
    loading: experienceLoading, 
    experiences, 
    fetchExperiences, 
    addExperience, 
    updateExperienceById, 
    removeExperience 
  } = useExperience();

  const { 
    loading: educationLoading, 
    educations, 
    fetchEducations, 
    addEducation, 
    updateEducationById, 
    removeEducation 
  } = useEducation();

  const { 
    searchSkills, 
    fetchAllGlobalSkills,
    loading: skillsLoading 
  } = useSkills();

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
        descripcion: user.descripcion || user.summary || user.description,
      });
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
    const loadEducations = async () => {
      if (!user) return;
      await fetchEducations();
    };

    loadEducations();
  }, [user]);

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
      descripcion: updatedUser.descripcion || updatedUser.summary || updatedUser.description,
    });
    setAuthUser(updatedUser);
  };

  // Funciones para experiencia
  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addExperiencia = async (e) => {
    e.preventDefault();
    if (!expForm.puesto.trim() || !expForm.empresa.trim()) return;

    const experienceData = {
      puesto: expForm.puesto,
      empresa: expForm.empresa,
      desde: expForm.desde,
      hasta: expForm.hasta,
      descripcion: expForm.descripcion,
      isCurrent: expForm.isCurrent,
    };

    const result = await addExperience(experienceData);
    if (result) {
      setExpForm({
        puesto: "",
        empresa: "",
        desde: "",
        hasta: "",
        descripcion: "",
        isCurrent: false,
        _id: null,
      });
      setEditExpIdx(null);
    }
  };

  const deleteExperiencia = async (experienceId) => {
    const success = await removeExperience(experienceId);
    if (success) {
      // La experiencia se elimina automáticamente del estado
    }
  };

  // Funciones para educación
  const handleEduChange = (e) => {
    const { name, value } = e.target;
    setEduForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEducacion = async (e) => {
    e.preventDefault();
    if (!eduForm.titulo.trim() || !eduForm.institucion.trim()) return;

    const educationData = {
      degree: eduForm.titulo,
      institution: eduForm.institucion,
      startDate: eduForm.desde,
      endDate: eduForm.hasta,
      description: eduForm.descripcion,
    };

    let result;
    if (editEduIdx !== null && editEduIdx !== 'new') {
      // Editing existing education
      const educationToEdit = educations[editEduIdx];
      result = await updateEducationById(educationToEdit._id, educationData);
    } else {
      // Adding new education
      result = await addEducation(educationData);
    }

    if (result) {
      setEduForm({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' });
      setEditEduIdx(null);
    }
  };

  const deleteEducacion = async (index) => {
    const educationToDelete = educations[index];
    if (educationToDelete && educationToDelete._id) {
      const success = await removeEducation(educationToDelete._id);
      if (success) {
        // Education is automatically removed from state by the hook
      }
    }
  };

  const loading = experienceLoading || educationLoading;

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
                  educacion={educations}
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
                <SkillsSection />
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