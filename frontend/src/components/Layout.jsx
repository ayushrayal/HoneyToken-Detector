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
      socket.on('newAlert', () => {
        setUnreadCount(prev => prev + 1);
      });

      socket.on('alertMarkedRead', () => {
        setUnreadCount(prev => Math.max(0, prev - 1));
      });

      socket.on('allAlertsMarkedRead', () => {
        setUnreadCount(0);
      });
    }

    return () => {
      if (socket) {
        socket.off('newAlert');
        socket.off('alertMarkedRead');
        socket.off('allAlertsMarkedRead');
      }
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
    <div className="flex h-screen bg-[#050507] overflow-hidden">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto p-10 relative">
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
        <Outlet context={{ setUnreadCount, unreadCount }} />
      </main>
    </div>
  );
};

export default Layout;
