import { useEffect, useState } from "react";
import useAuthStore from "../shared/stores/authStore";
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import ProfileProgressBar from "../components/UserProfile/ProfileProgressBar";
import ExperienceSection from "../components/UserProfile/ExperienceSection";
import EducationSection from "../components/UserProfile/EducationSection";
import SkillsSection from "../components/UserProfile/SkillsSection";
import ProfileSummary from "../components/UserProfile/ProfileSummary";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user); // escucha cambios del usuario
  const [showCVDialog, setShowCVDialog] = useState(false);
  const [profile, setProfile] = useState({});

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
    }
  }, [user]);

  const experiencia = user?.experiencia || [];
  const educacion = user?.educacion || [];
  const habilidades = user?.habilidades || [];
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
  };

  return (
    <div className="min-h-screen bg-white py-0 flex flex-col">
      <ProfileProgressBar porcentaje={porcentaje} />

      <ProfileHeader
        profile={profile}
        showCVDialog={showCVDialog}
        setShowCVDialog={setShowCVDialog}
      />

      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-16 py-10">
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <ProfileSummary profile={profile} refreshProfile={refreshProfile} />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <ExperienceSection
            experiencia={experiencia}
            expForm={{}}
            editExpIdx={null}
            setEditExpIdx={() => {}}
            setExpForm={() => {}}
            addExperiencia={() => {}}
            deleteExperiencia={() => {}}
            handleExpChange={() => {}}
          />
          <EducationSection
            educacion={educacion}
            eduForm={{}}
            editEduIdx={null}
            setEditEduIdx={() => {}}
            setEduForm={() => {}}
            addEducacion={() => {}}
            deleteEducacion={() => {}}
            handleEduChange={() => {}}
          />
          <SkillsSection
            habilidades={habilidades}
            editHabilidades={false}
            setEditHabilidades={() => {}}
            habilidadInput={""}
            setHabilidadInput={() => {}}
            addHabilidad={() => {}}
            deleteHabilidad={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
