import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if user is logged in (could wrap this in AuthContext consumer, 
    // but for simplicity we just connect globally)
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    setSocket(newSocket);

    // Global listener for new alerts
    newSocket.on('newAlert', (alert) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-dark-800 border-l-4 border-danger-main shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-dark-700`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white uppercase text-danger-main">
                  🚨 HONEYPOT TRIGGERED
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="text-primary-main font-semibold">{alert.fileName}</span> was {alert.action} by {alert.ipAddress}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-dark-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 6000, position: 'top-right' });
    });

    return () => {
      newSocket.off('newAlert');
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
