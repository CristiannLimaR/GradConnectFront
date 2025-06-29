import React, { useState } from 'react';
import { Building, MapPin, Clock, Users, DollarSign, ExternalLink, Bookmark } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

export default function JobDetails({ job }) {
  const [mensaje, setMensaje] = useState("");
  if (!job) return null;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-[900px] h-[1000px] overflow-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600 mb-4">
            <span className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {job.company}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {job.timePosted}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {job.applicants}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <span className="flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-1" />
          {job.type} • {job.level}
        </span>
        <span className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-1" />
          {job.employees} • Staffing and Recruiting
        </span>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <span className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </span>
      </div>
      <div className="flex space-x-4 mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium flex items-center">
              Aplicar ahora
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar aplicación</DialogTitle>
              <DialogDescription>
                Se compartirá tu perfil con la empresa.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <label htmlFor="mensaje-aplicacion" className="block text-sm font-medium text-gray-700 mb-1">Mensaje para la empresa (opcional)</label>
              <textarea
                id="mensaje-aplicacion"
                className="w-full border rounded px-3 py-2 min-h-[80px] text-base"
                placeholder="Escribe un mensaje para la empresa... (opcional)"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">Aceptar</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 font-medium flex items-center">
          Guardar empleo
          <Bookmark className="w-4 h-4 ml-2" />
        </button>
      </div>
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sobre el empleo</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {job.description}
        </p>
        {job.responsibilities && (
          <>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Tus responsabilidades incluirán</h3>
            <ul className="space-y-2 text-gray-600">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {responsibility}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
} 