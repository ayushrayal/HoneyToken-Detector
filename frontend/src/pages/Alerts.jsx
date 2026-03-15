import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Image as ImageIcon, AlertTriangle, ShieldAlert, Monitor } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

import { useOutletContext } from 'react-router-dom';

const Alerts = () => {
  const { setUnreadCount } = useOutletContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIntruder, setSelectedIntruder] = useState(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newAlert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      toast.error(`SECURITY BREACH: ${alert.fileName} accessed!`, {
        icon: '🚨',
        duration: 5000,
        position: 'top-right'
      });
    });

    socket.on('alertMarkedRead', ({ alertId }) => {
      setAlerts(prev => prev.map(a => a._id === alertId ? { ...a, isRead: true } : a));
    });

    socket.on('allAlertsMarkedRead', () => {
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    });

    return () => {
      socket.off('newAlert');
      socket.off('alertMarkedRead');
      socket.off('allAlertsMarkedRead');
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      // Update local state immediately for UX
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to update alert');
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/alerts/mark-all-read');
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
      setUnreadCount(0);
      toast.success('All alerts marked as read');
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'read') return alert.isRead;
    if (filter === 'unread') return !alert.isRead;
    return alert.severity === filter;
  });

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-danger-main bg-danger-main/5 text-danger-main';
      case 'high': return 'border-l-orange-500 bg-orange-500/5 text-orange-500';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5 text-yellow-500';
      case 'low': return 'border-l-blue-500 bg-blue-500/5 text-blue-500';
      default: return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-danger-main" />
            Security Alerts
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time notifications of honeypot breaches</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
            {['all', 'critical', 'high', 'read', 'unread'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-primary-main text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button 
            onClick={markAllRead} 
            disabled={!alerts.some(a => !a.isRead)}
            className="btn-primary space-x-2 py-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Glow effect for unread alerts */}
        {alerts.some(a => !a.isRead) && (
          <div className="absolute -inset-1 bg-gradient-to-r from-danger-main to-transparent opacity-20 blur-xl pointer-events-none rounded-xl"></div>
        )}

        <div className="glass-card divide-y divide-dark-700/50 relative z-10 overflow-hidden">
          {filteredAlerts.map(alert => (
            <div 
              key={alert._id} 
              className={`p-6 transition-all duration-300 hover:bg-dark-800/40 border-l-4 ${getSeverityStyles(alert.severity)} ${alert.isRead ? 'opacity-80' : 'opacity-100 shadow-[inset_0px_0px_20px_rgba(239,68,68,0.05)]'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    alert.severity === 'critical' ? 'bg-danger-main/20 text-danger-main animate-pulse' :
                    alert.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-dark-800 text-gray-500'
                  }`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        alert.severity === 'critical' ? 'bg-danger-main/10 border-danger-main/30' :
                        alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                        'bg-dark-700 border-dark-600'
                      }`}>
                        {alert.severity}
                      </span>
                      <h3 className={`text-lg font-bold flex items-center gap-2 ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>
                        {alert.message}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                      <div><span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">File Asset</span> {alert.fileName}</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Interaction</span> {alert.action.toUpperCase()}</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Source IP</span> {alert.ipAddress}</div>
                      <div><span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Forensic Time</span> {new Date(alert.timestamp).toLocaleString()}</div>
                    </div>

                    <div className="mt-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                       <p className="text-xs text-gray-500 truncate"><span className="font-bold text-gray-400">Device:</span> {alert.deviceInfo}</p>
                       <p className="text-xs text-gray-500 truncate"><span className="font-bold text-gray-400">OS:</span> {alert.operatingSystem}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                      {alert.snapshotUrl && (
                        <button 
                          onClick={() => setSelectedSnapshot(alert.snapshotUrl)}
                          className="flex items-center gap-2 text-sm text-primary-main hover:text-primary-hover transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View Dashboard Snapshot
                        </button>
                      )}

                      {alert.screenshotPath && (
                        <button 
                          onClick={() => setSelectedImage(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/screenshots/${alert.screenshotPath}`)}
                          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          <Monitor className="w-4 h-4" />
                          View Desktop Snapshot
                        </button>
                      )}

                      {alert.intruderImage && (
                        <button 
                          onClick={() => setSelectedIntruder(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/intruders/${alert.intruderImage}`)}
                          className="flex items-center gap-2 text-sm text-danger-main hover:text-red-400 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          View Intruder Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {!alert.isRead && (
                  <button 
                    onClick={() => markAsRead(alert._id)}
                    className="shrink-0 text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg border border-dark-600 hover:bg-dark-700 transition-colors h-fit"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="p-12 text-center text-gray-500">Loading alerts...</div>}
          {!loading && alerts.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-300">All Clear</h3>
              <p className="text-gray-500 mt-1">No security alerts have been triggered yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedSnapshot(null)}>
          <div className="relative glass-card max-w-5xl w-full p-2 border-dark-600" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-dark-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-main" />
                Forensic Snapshot at Time of Incident
              </h3>
              <button 
                onClick={() => setSelectedSnapshot(null)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[70vh]">
              <img src={selectedSnapshot} alt="Dashboard Snapshot" className="w-full h-auto rounded-lg border border-dark-700" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Screenshot Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative glass-card max-w-6xl w-full p-2 border-orange-500/30" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-dark-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-orange-500" />
                Desktop Capture at Time of Incident
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh]">
              <img src={selectedImage} alt="Desktop Screenshot" className="w-full h-auto rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      )}
      {/* Intruder Photo Modal */}
      {selectedIntruder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/98 backdrop-blur-md" onClick={() => setSelectedIntruder(null)}>
          <div className="relative glass-card max-w-4xl w-full p-2 border-danger-main/30" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-dark-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-danger-main" />
                Intruder Identified (Webcam Capture)
              </h3>
              <button 
                onClick={() => setSelectedIntruder(null)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-2">
              <img src={selectedIntruder} alt="Intruder Photo" className="w-full h-auto rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
