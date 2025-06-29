import useAuthStore from '../shared/stores/authStore';
import ProfileHeader from '../components/UserProfile/ProfileHeader';
import ProfileProgressBar from '../components/UserProfile/ProfileProgressBar';
import ExperienceSection from '../components/UserProfile/ExperienceSection';
import EducationSection from '../components/UserProfile/EducationSection';
import SkillsSection from '../components/UserProfile/SkillsSection';
import ProfileSummary from '../components/UserProfile/ProfileSummary';

export default function UserProfile() {
  // Obtener el usuario registrado desde el store
  const { user } = useAuthStore();

  // Adaptar los datos del usuario a los props esperados
  const profile = user ? {
    nombre: user.firstName,
    apellido: user.lastName,
    email: user.email,
    ubicacion: user.location,
    telefono: user.phone,
    foto: user.profilePhoto,
    cv: user.cvAdjunto,
    github: user.github,
    linkedin: user.linkedin,
    descripcion: user.description
  } : {};

  // Si tienes experiencia, educación y habilidades en el usuario, pásalas aquí
  const experiencia = user?.experiencia || [];
  const educacion = user?.educacion || [];
  const habilidades = user?.habilidades || [];
  const porcentaje = 0; // Puedes calcularlo si lo necesitas
  const showCVDialog = false;

  return (
    <div className="min-h-screen bg-white py-0 flex flex-col">
      {/* Barra de progreso de perfil */}
      <ProfileProgressBar porcentaje={porcentaje} />

      {/* Encabezado de perfil */}
      <ProfileHeader
        profile={profile}
        showCVDialog={showCVDialog}
        setShowCVDialog={() => {}}
        setEditProfile={() => {}}
      />

      {/* Layout de dos columnas en desktop */}
      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-16 py-10">
        {/* Vista o formulario de edición de perfil */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          {/* Aquí deberías mostrar el resumen o el formulario de edición según el estado */}
          <ProfileSummary
            profile={profile}
            setEditProfile={() => {}}
            showCVDialog={showCVDialog}
            setShowCVDialog={() => {}}
          />
        </div>

        {/* Apartados a la derecha */}
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
            habilidadInput={''}
            setHabilidadInput={() => {}}
            addHabilidad={() => {}}
            deleteHabilidad={() => {}}
          />
        </div>
      </div>
    </div>
  );
} 