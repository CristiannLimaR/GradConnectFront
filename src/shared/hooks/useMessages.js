import { useState, useEffect, useCallback } from 'react';
import { 
  getConversations, 
  getMessages, 
  sendMessage as sendMessageAPI, 
  markMessagesAsRead,
  startConversationWithCandidate 
} from '../../service/api';
import useSocket from './useSocket';
import { toast } from 'sonner';

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  
  const { 
    isConnected, 
    onNewMessage, 
    onUserTyping, 
    onUserStoppedTyping, 
    startTyping, 
    stopTyping,
    removeListener 
  } = useSocket();

  // Cargar conversaciones
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Error al cargar conversaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar mensajes de una conversación
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      const response = await getMessages(conversationId);
      if (response.success) {
        setMessages(response.data);
        // Marcar mensajes como leídos
        await markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(async (receiverId, receiverType, content, jobOfferId = null) => {
    try {
      setSending(true);
      const messageData = {
        receiverId,
        receiverType,
        content,
        jobOfferId
      };

      const response = await sendMessageAPI(messageData);
      if (response.success) {
        // Agregar mensaje a la lista local
        setMessages(prev => [...prev, response.data]);
        
        // Actualizar conversaciones
        await fetchConversations();
        
        toast.success('Mensaje enviado');
        return response.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
      throw error;
    } finally {
      setSending(false);
    }
  }, [fetchConversations]);

  // Iniciar conversación con candidato
  const startConversation = useCallback(async (candidateId, jobOfferId, initialMessage) => {
    try {
      setSending(true);
      const response = await startConversationWithCandidate(candidateId, jobOfferId, initialMessage);
      if (response.success) {
        // Recargar conversaciones
        await fetchConversations();
        toast.success('Conversación iniciada');
        return response.data;
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Error al iniciar conversación');
      throw error;
    } finally {
      setSending(false);
    }
  }, [fetchConversations]);

  // Seleccionar conversación
  const selectConversation = useCallback(async (conversation) => {
    setCurrentConversation(conversation);
    if (conversation) {
      await fetchMessages(conversation.conversationId);
    } else {
      setMessages([]);
    }
  }, [fetchMessages]);

  // Manejar indicadores de escritura
  const handleStartTyping = useCallback((receiverId, conversationId) => {
    if (currentConversation?.conversationId === conversationId) {
      startTyping(receiverId, conversationId);
    }
  }, [currentConversation, startTyping]);

  const handleStopTyping = useCallback((receiverId, conversationId) => {
    if (currentConversation?.conversationId === conversationId) {
      stopTyping(receiverId, conversationId);
    }
  }, [currentConversation, stopTyping]);

  // Configurar listeners de Socket.IO
  useEffect(() => {
    if (!isConnected) return;

    // Listener para nuevos mensajes
    const handleNewMessage = (message) => {
      // Si el mensaje es de la conversación actual, agregarlo
      if (currentConversation && message.conversationId === currentConversation.conversationId) {
        setMessages(prev => [...prev, message]);
      }
      
      // Actualizar lista de conversaciones
      fetchConversations();
      
      // Mostrar notificación si no es la conversación actual
      if (!currentConversation || message.conversationId !== currentConversation.conversationId) {
        const senderName = message.sender.name || `${message.sender.firstName} ${message.sender.lastName}`;
        toast.info(`Nuevo mensaje de ${senderName}`);
      }
    };

    // Listener para indicadores de escritura
    const handleUserTyping = ({ senderId, conversationId }) => {
      if (currentConversation?.conversationId === conversationId) {
        setTypingUsers(prev => ({ ...prev, [senderId]: true }));
      }
    };

    const handleUserStoppedTyping = ({ senderId, conversationId }) => {
      if (currentConversation?.conversationId === conversationId) {
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          delete newTyping[senderId];
          return newTyping;
        });
      }
    };

    // Registrar listeners
    onNewMessage(handleNewMessage);
    onUserTyping(handleUserTyping);
    onUserStoppedTyping(handleUserStoppedTyping);

    // Cleanup
    return () => {
      removeListener('newMessage', handleNewMessage);
      removeListener('userTyping', handleUserTyping);
      removeListener('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [isConnected, currentConversation, onNewMessage, onUserTyping, onUserStoppedTyping, removeListener, fetchConversations]);

  // Cargar conversaciones al montar
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    typingUsers,
    isConnected,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    selectConversation,
    handleStartTyping,
    handleStopTyping
  };
};

export default useMessages;
