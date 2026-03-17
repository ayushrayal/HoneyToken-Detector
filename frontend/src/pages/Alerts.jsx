import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Image as ImageIcon, AlertTriangle, ShieldAlert, Monitor, Trash2, Search, Filter, X, ChevronRight, Info } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Alerts = () => {
  const { setUnreadCount } = useOutletContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIntruder, setSelectedIntruder] = useState(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      toast.error('Alert database link failure');
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

    socket.on('alertMarkedRead', ({ alertId }) => {
      setAlerts(prev => prev.map(a => a._id === alertId ? { ...a, isRead: true } : a));
    });

    socket.on('allAlertsMarkedRead', () => {
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    });

    socket.on('alertDeleted', ({ alertId }) => {
      setAlerts(prev => prev.filter(a => a._id !== alertId));
      setSelectedAlerts(prev => prev.filter(id => id !== alertId));
    });

    socket.on('alertsBulkDeleted', ({ alertIds }) => {
      setAlerts(prev => prev.filter(a => !alertIds.includes(a._id)));
      setSelectedAlerts(prev => prev.filter(id => !alertIds.includes(id)));
    });

    return () => {
      socket.off('newAlert');
      socket.off('alertMarkedRead');
      socket.off('allAlertsMarkedRead');
      socket.off('alertDeleted');
      socket.off('alertsBulkDeleted');
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Update protocol failed');
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/alerts/mark-all-read');
      toast.success('All alerts synchronized');
    } catch (err) {
      toast.error('Bulk update failure');
    }
  };

  const deleteAlert = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      toast.success('Target purged');
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  const bulkDelete = async () => {
    if (selectedAlerts.length === 0) return;
    try {
      await api.post('/alerts/bulk-delete', { alertIds: selectedAlerts });
      toast.success('Batch sequence purged');
      setSelectedAlerts([]);
    } catch (err) {
      toast.error('Bulk purge failure');
    }
  };

  const toggleSelect = (id) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(a => a._id));
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' ? true : (filter === 'read' ? alert.isRead : (filter === 'unread' ? !alert.isRead : alert.severity === filter));
    const matchesSearch = alert.fileName.toLowerCase().includes(search.toLowerCase()) || 
                          alert.message.toLowerCase().includes(search.toLowerCase()) ||
                          alert.ipAddress.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical': return { color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/10', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' };
      case 'high': return { color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' };
      case 'medium': return { color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/10', glow: '' };
      case 'low': return { color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', glow: '' };
      default: return { color: 'text-gray-500', border: 'border-white/5', bg: 'bg-white/5', glow: '' };
    }
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-danger/10 rounded-2xl border border-danger/20">
               <Bell className="w-8 h-8 text-danger animate-neon" />
            </div>
            INCIDENT COMMAND
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Real-time threat feed and HoneyToken forensic management.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search by Target, IP, or Vector..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-12 h-12 text-sm bg-white/[0.02] border-white/5"
            />
          </div>
          <button 
            onClick={markAllRead}
            disabled={!alerts.some(a => !a.isRead)}
            className="h-12 px-6 rounded-xl border border-primary/20 text-primary font-bold text-sm hover:bg-primary/10 transition-all flex items-center gap-2 disabled:opacity-30"
          >
            <CheckCircle className="w-4 h-4" /> Synchronize All
          </button>
          <button 
            onClick={() => {}} // This will be handled by a bulk delete function if implemented
            disabled={selectedAlerts.length === 0}
            className="h-12 px-6 rounded-xl border border-danger/20 text-danger font-bold text-sm hover:bg-danger/10 transition-all flex items-center gap-2 disabled:opacity-30"
          >
            <Trash2 className="w-4 h-4" /> Purge Selected
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
           {['all', 'critical', 'high', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filter === f ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {f}
              </button>
           ))}
        </div>

        {selectedAlerts.length > 0 && (
          <div className="flex items-center gap-4 animate-slide-in">
             <span className="text-xs font-bold text-primary">{selectedAlerts.length} Units Selected</span>
             <button 
              onClick={bulkDelete}
              className="px-4 py-2 rounded-lg bg-danger/10 text-danger border border-danger/20 text-[10px] font-black uppercase tracking-widest hover:bg-danger/20 transition-all flex items-center gap-2"
             >
               <Trash2 className="w-3 h-3" /> Batch Purge
             </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
           <div className="w-5">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/20"
                checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                onChange={selectAll}
              />
           </div>
           <div className="flex-1">Alert Signature / Identification</div>
           <div className="w-32 text-center">Severity</div>
           <div className="w-48 text-right">Timestamp</div>
        </div>

        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, idx) => {
            const config = getSeverityConfig(alert.severity);
            return (
              <div 
                key={alert._id} 
                className={`glass-card group overflow-hidden border-white/[0.03] transition-all duration-500 animate-slide-in ${alert.isRead ? 'opacity-50 grayscale-[0.5]' : config.glow}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4 p-5 sm:p-7">
                  <div className="w-5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/20"
                      checked={selectedAlerts.includes(alert._id)}
                      onChange={() => toggleSelect(alert._id)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                       <span className={`text-sm font-black tracking-tight ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>
                          {alert.fileName}
                       </span>
                       {!alert.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
                    </div>
                    <p className="text-xs text-gray-500 font-medium truncate">{alert.message}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3" /> {alert.ipAddress}</span>
                       <span className="flex items-center gap-1.5"><Info className="w-3 h-3" /> {alert.action}</span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      {alert.snapshotUrl && (
                        <button onClick={() => setSelectedSnapshot(alert.snapshotUrl)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3" /> Dashboard
                        </button>
                      )}
                      {alert.screenshotPath && (
                        <button onClick={() => setSelectedImage(`${BASE_URL}/screenshots/${alert.screenshotPath}`)} className="text-[10px] font-black uppercase tracking-widest text-warning hover:text-white transition-colors flex items-center gap-1.5">
                          <Monitor className="w-3 h-3" /> Desktop
                        </button>
                      )}
                      {alert.intruderImage && (
                        <button onClick={() => setSelectedIntruder(`${BASE_URL}/intruders/${alert.intruderImage}`)} className="text-[10px] font-black uppercase tracking-widest text-danger hover:text-white transition-colors flex items-center gap-1.5">
                          <ShieldAlert className="w-3 h-3" /> Intruder
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-32 flex flex-col items-center gap-2">
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${config.border} ${config.bg} ${config.color}`}>
                       {alert.severity}
                    </span>
                  </div>

                  <div className="w-48 text-right space-y-2">
                    <div className="text-xs font-mono font-bold text-gray-200">
                       {new Date(alert.timestamp).toLocaleTimeString([], { hour12: false })}
                    </div>
                    <div className="text-[10px] font-bold text-gray-600">
                       {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!alert.isRead && (
                      <button 
                        onClick={() => markAsRead(alert._id)}
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Mark Read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAlert(alert._id)}
                      className="p-2 rounded-lg bg-danger/5 text-danger/50 hover:text-danger hover:bg-danger/10 transition-all"
                      title="Purge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="glass-card py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-3xl flex items-center justify-center mb-6 border border-white/5">
               <ShieldAlert className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Threats Detected</h3>
            <p className="text-gray-500 text-sm max-w-xs font-medium">Monitoring system is active. All security protocols are currently within nominal parameters.</p>
          </div>
        )}
      </div>

      {/* Forensic Modals */}
      {(selectedSnapshot || selectedImage || selectedIntruder) && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => { setSelectedSnapshot(null); setSelectedImage(null); setSelectedIntruder(null); }}
        >
          <div 
            className="relative glass-card max-w-6xl w-full p-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-lg font-black text-white tracking-widest uppercase flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg"><ImageIcon className="w-5 h-5 text-primary" /></div>
                 Forensic Proof of Interaction
              </h3>
              <button onClick={() => { setSelectedSnapshot(null); setSelectedImage(null); setSelectedIntruder(null); }} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[75vh]">
              <img 
                src={selectedSnapshot || selectedImage || selectedIntruder} 
                alt="Forensic Evidence" 
                className="w-full h-auto rounded-xl border border-white/5 shadow-2xl" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
