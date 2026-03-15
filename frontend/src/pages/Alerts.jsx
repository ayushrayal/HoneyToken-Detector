import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Image as ImageIcon, AlertTriangle, ShieldAlert, Monitor } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
    });

    return () => {
      socket.off('newAlert');
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts(alerts.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch (err) {
      toast.error('Failed to update alert');
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/alerts/mark-all-read');
      setAlerts(alerts.map(a => ({ ...a, isRead: true })));
      toast.success('All alerts marked as read');
    } catch (err) {
      toast.error('Operation failed');
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
        
        <button 
          onClick={markAllRead} 
          disabled={!alerts.some(a => !a.isRead)}
          className="btn-primary space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="relative">
        {/* Glow effect for unread alerts */}
        {alerts.some(a => !a.isRead) && (
          <div className="absolute -inset-1 bg-gradient-to-r from-danger-main to-transparent opacity-20 blur-xl pointer-events-none rounded-xl"></div>
        )}

        <div className="glass-card divide-y divide-dark-700/50 relative z-10 overflow-hidden">
          {alerts.map(alert => (
            <div 
              key={alert._id} 
              className={`p-6 transition-colors ${alert.isRead ? 'bg-transparent' : 'bg-danger-main/5 border-l-4 border-l-danger-main'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full shrink-0 ${alert.isRead ? 'bg-dark-800 text-gray-400' : 'bg-danger-main/20 text-danger-main glow-danger'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-bold ${alert.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {alert.message}
                    </h3>
                    
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-400">
                      <p><span className="text-gray-500">File:</span> {alert.fileName}</p>
                      <p><span className="text-gray-500">Action:</span> {alert.action.toUpperCase()}</p>
                      <p><span className="text-gray-500">IP:</span> {alert.ipAddress}</p>
                      <p><span className="text-gray-500">Device:</span> {alert.deviceInfo}</p>
                      <p><span className="text-gray-500">OS:</span> {alert.operatingSystem}</p>
                      <p><span className="text-gray-500">User Agent:</span> {alert.userAgent}</p>
                      <p><span className="text-gray-500">Time:</span> {new Date(alert.timestamp).toLocaleString()}</p>
                      <p><span className="text-gray-500">Email:</span> {alert.emailSent ? <span className="text-success">Sent</span> : <span className="text-gray-600">Failed/Disabled</span>}</p>
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
                          View Incident Snapshot (Desktop)
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
    </div>
  );
};

export default Alerts;
