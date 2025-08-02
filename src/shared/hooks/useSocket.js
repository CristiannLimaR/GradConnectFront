import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../stores/authStore';

const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Crear conexión Socket.IO
    socketRef.current = io('http://localhost:3000', {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
      setIsConnected(true);
      
      // Unirse a la sala del usuario
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor Socket.IO');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.IO:', error);
      setIsConnected(false);
    });

    // Cleanup al desmontar
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  // Función para enviar mensaje
  const sendMessage = (messageData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', messageData);
    }
  };

  // Función para indicar que está escribiendo
  const startTyping = (receiverId, conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', {
        senderId: user.id,
        receiverId,
        conversationId
      });
    }
  };

  // Función para dejar de indicar que está escribiendo
  const stopTyping = (receiverId, conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('stopTyping', {
        senderId: user.id,
        receiverId,
        conversationId
      });
    }
  };

  // Función para escuchar nuevos mensajes
  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('newMessage', callback);
    }
  };

  // Función para escuchar indicadores de escritura
  const onUserTyping = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('userTyping', callback);
    }
  };

  const onUserStoppedTyping = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('userStoppedTyping', callback);
    }
  };

  // Función para remover listeners
  const removeListener = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
    removeListener
  };
};

export default useSocket;
