import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { SocketContext } from '../context/SocketContext';

const Layout = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const socket = useContext(SocketContext);
  
  // Is this the puppeteer snapshot bot?
  const isSnapshotRequest = new URLSearchParams(location.search).get('snapshot') === 'true';

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/alerts/unread-count');
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    fetchUnread();

    if (socket) {
      socket.on('new_alert', () => {
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (socket) socket.off('new_alert');
    };
  }, [socket]);

  if (isSnapshotRequest) {
    return (
      <div className="min-h-screen bg-dark-900 text-gray-200">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 -z-10"></div>
        <Outlet context={{ setUnreadCount, unreadCount }} />
      </main>
    </div>
  );
};

export default Layout;
