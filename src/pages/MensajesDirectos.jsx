import React, { useState } from 'react';
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Mail, Phone, MessageSquare } from 'lucide-react';
import useMessages from '../shared/hooks/useMessages';
import useAuthStore from '../shared/stores/authStore';
import { toast } from 'sonner';

export default function MensajesDirectos() {
  const { user } = useAuthStore();
  
  // Debug: Log user object
  console.log('=== USER DEBUG ===');
  console.log('user object:', user);
  console.log('user.id:', user?.id);
  console.log('user.id type:', typeof user?.id);
  console.log('=== END USER DEBUG ===');
  
  const {
    conversations,
    currentConversation,
    messages,
    loading: messagesLoading,
    sending,
    isConnected,
    selectConversation,
    sendMessage,
    handleStartTyping,
    handleStopTyping
  } = useMessages();

  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const enviarMensaje = async () => {
    if (!currentConversation || !nuevoMensaje.trim()) {
      return;
    }

    try {
      await sendMessage(
        currentConversation.otherParticipant.id,
        currentConversation.otherParticipant.type,
        nuevoMensaje.trim(),
        currentConversation.jobOffer?._id
      );
      
      setNuevoMensaje("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <div style={{ 
      width: "100vw", 
      minHeight: "calc(100vh - 64px)", 
      padding: 0, 
      margin: 0, 
      display: "flex", 
      gap: 0, 
      background: "#f8fafc", 
      overflowX: "hidden" 
    }}>
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        background: "#f8fafc", 
        minWidth: 0 
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          width: "100%", 
          padding: "24px" 
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "24px" 
          }}>
            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: 700, 
              color: "#111827" 
            }}>
              Mensajes de candidatos
            </h2>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px" 
            }}>
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: isConnected ? "#10b981" : "#ef4444"
              }}></div>
              <span style={{ 
                fontSize: "14px", 
                color: "#6b7280" 
              }}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            {/* Lista de conversaciones */}
            <div style={{ 
              width: "320px", 
              background: "#fff", 
              borderRadius: "8px", 
              border: "1px solid #e5e7eb", 
              minWidth: 0 
            }}>
              <div style={{ 
                padding: "16px", 
                borderBottom: "1px solid #e5e7eb" 
              }}>
                <h3 style={{ 
                  fontWeight: 600, 
                  fontSize: "16px", 
                  color: "#111827" 
                }}>
                  Conversaciones
                </h3>
                {messagesLoading && (
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#6b7280", 
                    marginTop: "4px" 
                  }}>
                    Cargando...
                  </div>
                )}
              </div>
              <div style={{ 
                maxHeight: "600px", 
                overflowY: "auto" 
              }}>
                {conversations.length === 0 ? (
                  <div style={{ 
                    padding: "32px", 
                    textAlign: "center", 
                    color: "#6b7280" 
                  }}>
                    <MessageSquare style={{ 
                      width: "32px", 
                      height: "32px", 
                      margin: "0 auto 8px", 
                      color: "#d1d5db" 
                    }} />
                    <p style={{ 
                      fontSize: "14px", 
                      margin: 0 
                    }}>
                      No hay conversaciones
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.conversationId}
                      onClick={() => selectConversation(conversation)}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #e5e7eb",
                        cursor: "pointer",
                        background: currentConversation?.conversationId === conversation.conversationId ? "#eff6ff" : "transparent",
                        borderLeft: currentConversation?.conversationId === conversation.conversationId ? "4px solid #3b82f6" : "4px solid transparent",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (currentConversation?.conversationId !== conversation.conversationId) {
                          e.target.style.background = "#f9fafb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentConversation?.conversationId !== conversation.conversationId) {
                          e.target.style.background = "transparent";
                        }
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        alignItems: "flex-start", 
                        justifyContent: "space-between", 
                        marginBottom: "8px" 
                      }}>
                        <div style={{ 
                          flex: 1, 
                          minWidth: 0 
                        }}>
                          <h4 style={{ 
                            fontWeight: 500, 
                            fontSize: "14px", 
                            color: "#111827", 
                            margin: 0, 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap" 
                          }}>
                            {conversation.otherParticipant.name}
                          </h4>
                          {conversation.jobOffer && (
                            <p style={{ 
                              fontSize: "12px", 
                              color: "#6b7280", 
                              margin: "2px 0 0 0", 
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "nowrap" 
                            }}>
                              {conversation.jobOffer.title}
                            </p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div style={{ 
                            width: "8px", 
                            height: "8px", 
                            background: "#3b82f6", 
                            borderRadius: "50%", 
                            marginLeft: "8px", 
                            flexShrink: 0 
                          }}></div>
                        )}
                      </div>
                      <p style={{ 
                        fontSize: "14px", 
                        color: "#6b7280", 
                        margin: "0 0 4px 0", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap" 
                      }}>
                        {conversation.lastMessage.isFromMe ? 'Tú: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      <p style={{ 
                        fontSize: "12px", 
                        color: "#9ca3af", 
                        margin: 0 
                      }}>
                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Conversación seleccionada */}
            <div style={{ 
              flex: 1, 
              background: "#fff", 
              borderRadius: "8px", 
              border: "1px solid #e5e7eb", 
              minWidth: 0 
            }}>
              {currentConversation ? (
                <>
                  <div style={{ 
                    padding: "16px", 
                    borderBottom: "1px solid #e5e7eb" 
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between" 
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ 
                          fontWeight: 600, 
                          fontSize: "16px", 
                          color: "#111827", 
                          margin: "0 0 4px 0", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap" 
                        }}>
                          {currentConversation.otherParticipant.name}
                        </h3>
                        {currentConversation.jobOffer && (
                          <p style={{ 
                            fontSize: "14px", 
                            color: "#6b7280", 
                            margin: "0 0 2px 0", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap" 
                          }}>
                            {currentConversation.jobOffer.title}
                          </p>
                        )}
                        <p style={{ 
                          fontSize: "12px", 
                          color: "#9ca3af", 
                          margin: 0, 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap" 
                        }}>
                          {currentConversation.otherParticipant.email}
                        </p>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        gap: "8px", 
                        flexShrink: 0 
                      }}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={{ 
                            height: "32px", 
                            fontSize: "12px", 
                            padding: "0 12px" 
                          }}
                          onClick={() => window.open(`mailto:${currentConversation.otherParticipant.email}`, '_blank')}
                        >
                          <Mail style={{ 
                            width: "14px", 
                            height: "14px", 
                            marginRight: "4px" 
                          }} />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    height: "500px", 
                    overflowY: "auto", 
                    padding: "16px" 
                  }}>
                    {messagesLoading ? (
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        height: "100%" 
                      }}>
                        <div style={{ color: "#6b7280" }}>
                          Cargando mensajes...
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "16px" 
                      }}>
                        {messages.map((message) => {
                          // Intentar obtener el sender ID de diferentes maneras
                          const senderIdRaw = message.sender?._id || message.sender?.id || message.sender || null;
                          const senderId = (typeof senderIdRaw === 'string') ? senderIdRaw : (senderIdRaw?.toString ? senderIdRaw.toString() : null);
                          const isFromMe = senderId === user.id;
                          
                          console.log('=== DETAILED MESSAGE DEBUG ===');
                          console.log('messageId:', message._id);
                          console.log('senderRaw:', message.sender);
                          console.log('senderIdRaw:', senderIdRaw);
                          console.log('senderIdRaw type:', typeof senderIdRaw);
                          console.log('senderId (after toString):', senderId);
                          console.log('senderId type:', typeof senderId);
                          console.log('userId:', user.id);
                          console.log('userId type:', typeof user.id);
                          console.log('senderId === userId:', senderId === user.id);
                          console.log('isFromMe:', isFromMe);
                          console.log('senderModel:', message.senderModel);
                          console.log('content:', message.content.substring(0, 20) + '...');
                          console.log('=== END DETAILED DEBUG ===');
                          
                          return (
                            <div
                              key={message._id}
                              style={{ 
                                display: "flex", 
                                justifyContent: isFromMe ? 'flex-end' : 'flex-start',
                                marginBottom: "16px",
                                width: "100%"
                              }}
                            >
                              <div
                                style={{
                                  maxWidth: "70%",
                                  padding: "12px 16px",
                                  borderRadius: isFromMe ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                                  backgroundColor: isFromMe ? "#3b82f6" : "#f3f4f6",
                                  color: isFromMe ? "#ffffff" : "#374151",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  position: "relative",
                                  alignSelf: isFromMe ? 'flex-end' : 'flex-start'
                                }}
                              >
                                <div style={{ 
                                  fontSize: "14px", 
                                  lineHeight: "1.4",
                                  wordWrap: "break-word",
                                  marginBottom: "4px"
                                }}>
                                  {message.content}
                                </div>
                                <div style={{ 
                                  fontSize: "11px", 
                                  color: isFromMe ? "rgba(255, 255, 255, 0.7)" : "#6b7280",
                                  textAlign: "right",
                                  marginTop: "4px"
                                }}>
                                  {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    padding: "16px", 
                    borderTop: "1px solid #e5e7eb" 
                  }}>
                    <div style={{ 
                      display: "flex", 
                      gap: "8px" 
                    }}>
                      <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
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
                        disabled={sending || !nuevoMensaje.trim()}
                        style={{ 
                          height: "44px", 
                          fontSize: "14px",
                          padding: "0 16px",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: sending ? "not-allowed" : "pointer",
                          opacity: sending || !nuevoMensaje.trim() ? 0.6 : 1
                        }}
                      >
                        {sending ? 'Enviando...' : 'Enviar'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "600px", 
                  color: "#6b7280" 
                }}>
                  <div style={{ textAlign: "center" }}>
                    <MessageSquare style={{ 
                      width: "48px", 
                      height: "48px", 
                      margin: "0 auto 8px", 
                      color: "#d1d5db" 
                    }} />
                    <p style={{ margin: 0 }}>
                      Selecciona una conversación para ver los mensajes
                    </p>
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
