import React, { useState } from 'react';
import AppliedJobList from '../components/AppliedJobList';
import BottomCTA from '../components/BottomCTA';

export default function AppliedSavedJobs() {
  // Simulación de trabajos guardados/aplicados
  const [jobs] = useState([
    {
      id: 10,
      title: "Frontend Developer",
      company: "Tech Solutions",
      location: "Madrid (Remoto)",
      timePosted: "Hace 2 días",
      applicants: "23 aplicantes",
      salary: "€35,000 - €45,000 / Año",
      employees: "11-50 empleados",
      type: "Full Time",
      level: "Mid Level",
      isRemote: true,
      logo: "💻",
      description: "Desarrolla interfaces modernas y eficientes para clientes internacionales.",
      status: "aplicado"
    },
    {
      id: 11,
      title: "Backend Engineer",
      company: "DataCorp",
      location: "Barcelona",
      timePosted: "Hace 5 días",
      applicants: "12 aplicantes",
      salary: "€40,000 - €55,000 / Año",
      employees: "51-200 empleados",
      type: "Part Time",
      level: "Senior Level",
      isRemote: false,
      logo: "🗄️",
      description: "Implementa y optimiza APIs y servicios de datos.",
      status: "guardado"
    }
  ]);
  const [selectedJob, setSelectedJob] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Trabajos aplicados o guardados</h1>
        <AppliedJobList jobs={jobs} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
      </div>
      <BottomCTA />
    </div>
  );
} 