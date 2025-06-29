import React, { useState } from 'react';
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Mail, Phone, MessageSquare } from 'lucide-react';

// Simulación de mensajes de candidatos (debería venir de un contexto o prop en app real)
const MENSAJES = [
  {
    id: 1,
    candidato: 'Juan Pérez',
    email: 'juan@email.com',
    oferta: 'Desarrollador Frontend',
    ultimoMensaje: 'Me interesa mucho esta posición. ¿Podríamos agendar una entrevista?',
    fecha: 'Hace 2 horas',
    leido: false,
    conversacion: [
      { id: 1, autor: 'candidato', mensaje: 'Hola, me interesa mucho esta posición. Tengo 3 años de experiencia en React y Node.js.', fecha: 'Hace 2 días' },
      { id: 2, autor: 'empresa', mensaje: 'Hola Juan, gracias por tu interés. ¿Podrías enviarnos tu CV actualizado?', fecha: 'Hace 1 día' },
      { id: 3, autor: 'candidato', mensaje: 'Por supuesto, ya lo he enviado. ¿Podríamos agendar una entrevista?', fecha: 'Hace 2 horas' }
    ]
  },
  {
    id: 2,
    candidato: 'María García',
    email: 'maria@email.com',
    oferta: 'Desarrollador Frontend',
    ultimoMensaje: 'Perfecto, estaré disponible el martes a las 10:00 AM.',
    fecha: 'Hace 1 día',
    leido: true,
    conversacion: [
      { id: 1, autor: 'candidato', mensaje: 'Perfecto para mi perfil. He trabajado con las tecnologías que mencionan.', fecha: 'Hace 3 días' },
      { id: 2, autor: 'empresa', mensaje: 'Excelente María. ¿Te parece bien el martes a las 10:00 AM para la entrevista?', fecha: 'Hace 1 día' },
      { id: 3, autor: 'candidato', mensaje: 'Perfecto, estaré disponible el martes a las 10:00 AM.', fecha: 'Hace 1 día' }
    ]
  },
  {
    id: 3,
    candidato: 'Carlos López',
    email: 'carlos@email.com',
    oferta: 'Desarrollador Backend',
    ultimoMensaje: 'Gracias por la oportunidad. Espero su respuesta.',
    fecha: 'Hace 3 días',
    leido: true,
    conversacion: [
      { id: 1, autor: 'candidato', mensaje: 'Me encantaría formar parte del equipo. Tengo experiencia en Python y Django.', fecha: 'Hace 5 días' },
      { id: 2, autor: 'empresa', mensaje: 'Hola Carlos, gracias por tu aplicación. Revisaremos tu perfil y te contactaremos pronto.', fecha: 'Hace 3 días' },
      { id: 3, autor: 'candidato', mensaje: 'Gracias por la oportunidad. Espero su respuesta.', fecha: 'Hace 3 días' }
    ]
  }
];

export default function MensajesDirectos() {
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "" || !conversacionSeleccionada) return;
    
    const nuevoMensajeObj = {
      id: conversacionSeleccionada.conversacion.length + 1,
      autor: 'empresa',
      mensaje: nuevoMensaje,
      fecha: 'Ahora'
    };

    setConversacionSeleccionada({
      ...conversacionSeleccionada,
      conversacion: [...conversacionSeleccionada.conversacion, nuevoMensajeObj],
      ultimoMensaje: nuevoMensaje,
      fecha: 'Ahora',
      leido: false
    });

    setNuevoMensaje("");
  };

  return (
    <div style={{ width: "100vw", minHeight: "calc(100vh - 64px)", padding: 0, margin: 0, display: "flex", gap: 0, background: "#f8fafc", overflowX: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc", minWidth: 0 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px", color: "#111827" }}>Mensajes de candidatos</h2>
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Lista de conversaciones */}
            <div style={{ width: "320px", background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", minWidth: 0 }}>
              <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>Conversaciones</h3>
              </div>
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                {MENSAJES.map((mensaje) => (
                  <div
                    key={mensaje.id}
                    onClick={() => setConversacionSeleccionada(mensaje)}
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #e5e7eb",
                      cursor: "pointer",
                      background: conversacionSeleccionada?.id === mensaje.id ? "#eff6ff" : "transparent",
                      borderLeft: conversacionSeleccionada?.id === mensaje.id ? "4px solid #3b82f6" : "4px solid transparent",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (conversacionSeleccionada?.id !== mensaje.id) {
                        e.target.style.background = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (conversacionSeleccionada?.id !== mensaje.id) {
                        e.target.style.background = "transparent";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontWeight: 500, fontSize: "14px", color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mensaje.candidato}</h4>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mensaje.oferta}</p>
                      </div>
                      {!mensaje.leido && (
                        <div style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%", marginLeft: "8px", flexShrink: 0 }}></div>
                      )}
                    </div>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mensaje.ultimoMensaje}</p>
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{mensaje.fecha}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversación seleccionada */}
            <div style={{ flex: 1, background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", minWidth: 0 }}>
              {conversacionSeleccionada ? (
                <>
                  <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#111827", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversacionSeleccionada.candidato}</h3>
                        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversacionSeleccionada.oferta}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversacionSeleccionada.email}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <Button variant="outline" size="sm" style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}>
                          <Mail style={{ width: "14px", height: "14px", marginRight: "4px" }} />
                          Email
                        </Button>
                        <Button variant="outline" size="sm" style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}>
                          <Phone style={{ width: "14px", height: "14px", marginRight: "4px" }} />
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: "500px", overflowY: "auto", padding: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {conversacionSeleccionada.conversacion.map((msg) => (
                        <div
                          key={msg.id}
                          style={{ display: "flex", justifyContent: msg.autor === 'empresa' ? 'flex-end' : 'flex-start' }}
                        >
                          <div
                            style={{
                              maxWidth: "70%",
                              padding: "12px",
                              borderRadius: "8px",
                              background: msg.autor === 'empresa' ? "#3b82f6" : "#f3f4f6",
                              color: msg.autor === 'empresa' ? "#ffffff" : "#111827"
                            }}
                          >
                            <p style={{ fontSize: "14px", margin: "0 0 4px 0", lineHeight: "1.4" }}>{msg.mensaje}</p>
                            <p style={{ 
                              fontSize: "12px", 
                              margin: 0, 
                              color: msg.autor === 'empresa' ? "rgba(255, 255, 255, 0.8)" : "#6b7280" 
                            }}>
                              {msg.fecha}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            enviarMensaje();
                          }
                        }}
                        style={{ 
                          flex: 1, 
                          resize: "none", 
                          minHeight: "44px", 
                          fontSize: "14px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontFamily: "inherit"
                        }}
                        rows={2}
                      />
                      <Button 
                        onClick={enviarMensaje}
                        style={{ 
                          height: "44px", 
                          fontSize: "14px", 
                          padding: "0 16px",
                          background: "#3b82f6",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 500
                        }}
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "600px", color: "#6b7280" }}>
                  <div style={{ textAlign: "center" }}>
                    <MessageSquare style={{ width: "48px", height: "48px", margin: "0 auto 8px auto", color: "#d1d5db" }} />
                    <p style={{ margin: 0, fontSize: "16px" }}>Selecciona una conversación para ver los mensajes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 