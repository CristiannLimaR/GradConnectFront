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

  // Estados locales para experiencia y educación
  const [editExpIdx, setEditExpIdx] = useState(null);
  const [expForm, setExpForm] = useState({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '' });
  const [experiencia, setExperiencia] = useState([]);

  const [editEduIdx, setEditEduIdx] = useState(null);
  const [eduForm, setEduForm] = useState({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' });
  const [educacion, setEducacion] = useState([]);

  // Estados y handlers para habilidades
  const [editHabilidades, setEditHabilidades] = useState(false);
  const [habilidadInput, setHabilidadInput] = useState("");
  const [habilidades, setHabilidades] = useState([]);

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
      setExperiencia(user.experiencia || []);
      setEducacion(user.educacion || []);
      setHabilidades(user.habilidades || []);
    }
  }, [user]);

  // Handlers para experiencia
  const handleExpChange = (e) => {
    setExpForm({ ...expForm, [e.target.name]: e.target.value });
  };

  const addExperiencia = (e) => {
    e.preventDefault();
    if (editExpIdx === 'new') {
      setExperiencia([...experiencia, expForm]);
    } else if (typeof editExpIdx === 'number') {
      const updated = [...experiencia];
      updated[editExpIdx] = expForm;
      setExperiencia(updated);
    }
    setEditExpIdx(null);
    setExpForm({ puesto: '', empresa: '', desde: '', hasta: '', descripcion: '' });
  };

  const deleteExperiencia = (idx) => {
    setExperiencia(experiencia.filter((_, i) => i !== idx));
  };

  // Handlers para educación
  const handleEduChange = (e) => {
    setEduForm({ ...eduForm, [e.target.name]: e.target.value });
  };

  const addEducacion = (e) => {
    e.preventDefault();
    if (editEduIdx === 'new') {
      setEducacion([...educacion, eduForm]);
    } else if (typeof editEduIdx === 'number') {
      const updated = [...educacion];
      updated[editEduIdx] = eduForm;
      setEducacion(updated);
    }
    setEditEduIdx(null);
    setEduForm({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' });
  };

  const deleteEducacion = (idx) => {
    setEducacion(educacion.filter((_, i) => i !== idx));
  };

  // Handlers para habilidades
  const addHabilidad = (e) => {
    e.preventDefault();
    if (habilidadInput.trim() && !habilidades.includes(habilidadInput.trim())) {
      setHabilidades([...habilidades, habilidadInput.trim()]);
      setHabilidadInput("");
    }
  };

  const deleteHabilidad = (idx) => {
    setHabilidades(habilidades.filter((_, i) => i !== idx));
  };

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
            expForm={expForm}
            editExpIdx={editExpIdx}
            setEditExpIdx={setEditExpIdx}
            setExpForm={setExpForm}
            addExperiencia={addExperiencia}
            deleteExperiencia={deleteExperiencia}
            handleExpChange={handleExpChange}
          />
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
          <SkillsSection
            habilidades={habilidades}
            editHabilidades={editHabilidades}
            setEditHabilidades={setEditHabilidades}
            habilidadInput={habilidadInput}
            setHabilidadInput={setHabilidadInput}
            addHabilidad={addHabilidad}
            deleteHabilidad={deleteHabilidad}
          />
        </div>
      </div>
    </div>
  );
}
