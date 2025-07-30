import { useEffect, useState } from "react";
import useAuthStore from "../shared/stores/authStore";
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import ProfileProgressBar from "../components/UserProfile/ProfileProgressBar";
import ExperienceSection from "../components/UserProfile/ExperienceSection";
import EducationSection from "../components/UserProfile/EducationSection";
import SkillsSection from "../components/UserProfile/SkillsSection";
import ProfileSummary from "../components/UserProfile/ProfileSummary";
import { saveExperience, updateExperience, getExperience, deleteExperience } from "../service/api";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.updateUser);

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados locales para educación
  const [editEduIdx, setEditEduIdx] = useState(null);
  const [eduForm, setEduForm] = useState({ titulo: '', institucion: '', desde: '', hasta: '', descripcion: '' });
  const [educacion, setEducacion] = useState([]);

  // Estados y handlers para habilidades
  const [editHabilidades, setEditHabilidades] = useState(false);
  const [habilidadInput, setHabilidadInput] = useState("");
  const [habilidades, setHabilidades] = useState([]);

  // Estados para experiencia
  const [experiencia, setExperiencia] = useState([]);

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

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!user) return;
      try {
        const response = await getExperience();
        if (response.success) {
          const updatedUser = {
            ...user,
            experiencia: response.data.experiences,
          };
          refreshProfile(updatedUser);
        }
      } catch (error) {
        setError("Error al cargar experiencias.");
      }
    };

    fetchExperiences();
  }, []);

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
    setLoading(true);
    setError(null);

    try {
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
        if (!experienceId) throw new Error("ID de experiencia no encontrado.");
        result = await updateExperience(experienceId, dataToSend);
      } else {
        result = await saveExperience(dataToSend);
      }

      if (result.success) {
        const updatedProfileResponse = await getExperience();
        if (updatedProfileResponse.success) {
          const updatedUser = {
            ...user,
            experiencia: updatedProfileResponse.data.experiences,
          };
          refreshProfile(updatedUser);
        }
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
      } else {
        const msg = result.e?.response?.data?.msg || result.e?.message;
        setError(`Error al guardar experiencia: ${msg}`);
      }
    } catch (err) {
      setError(`Error inesperado: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperiencia = async (experienceId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteExperience(experienceId);
      if (result.success) {
        const updatedProfileResponse = await getExperience();
        if (updatedProfileResponse.success) {
          const updatedUser = {
            ...user,
            experiencia: updatedProfileResponse.data.experiences || [],
          };
          refreshProfile(updatedUser);
        }
      } else {
        const msg = result.e?.response?.data?.msg || result.e?.message;
        setError(`Error al eliminar experiencia: ${msg}`);
      }
    } catch (err) {
      setError(`Error inesperado al eliminar: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  // Funciones placeholder para educación y habilidades (necesarias para los componentes)
  const addEducacion = () => {};
  const deleteEducacion = () => {};
  const handleEduChange = () => {};
  const addHabilidad = () => {};
  const deleteHabilidad = () => {};

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
          {loading && <p className="text-blue-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

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
