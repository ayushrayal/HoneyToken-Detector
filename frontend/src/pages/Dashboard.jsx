import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, AlertTriangle, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell
} from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { Monitor, Terminal, Zap, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, delay, trend }) => (
  <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-all duration-500 animate-slide-in" style={{ animationDelay: `${delay}ms` }}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 ${colorClass.bg}`}></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-xl border ${colorClass.border} ${colorClass.iconBg} group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`w-6 h-6 ${colorClass.text}`} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${trend.startsWith('+') ? 'text-success border-success/20 bg-success/5' : 'text-danger border-danger/20 bg-danger/5'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-1.5">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Forensic data retrieval failed:', err);
      setError(true);
      toast.error('Forensic data retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  const socket = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (alert) => {
       setStats(prev => {
         if (!prev) return prev;
         return {
           ...prev,
           unreadAlerts: prev.unreadAlerts + 1,
           recentActivity: [alert, ...(prev.recentActivity || [])].slice(0, 10)
         };
       });
       toast.error(`BREACH DETECTED: ${alert.fileName}`, {
         style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }
       });
    };

    socket.on('newAlert', handleNewAlert);
    return () => socket.off('newAlert', handleNewAlert);
  }, [socket]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        </div>
        <p className="text-xs font-black text-primary/60 uppercase tracking-[0.3em] animate-pulse">Initializing SOC Interface</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 animate-fade-in">
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20">
          <ShieldAlert className="w-12 h-12 text-danger" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">System Link Interrupted</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Failed to load dashboard data. This could be due to a server fault or network instability.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="px-6 py-2.5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> Re-establish Link
        </button>
      </div>
    );
  }

  // Format data for Recharts
  const areaData = stats.activityTimeline?.map(item => ({ name: item._id, value: item.count })) || [];
  const barData = stats.topAttackedFiles?.slice(0, 5).map(item => ({ 
    name: item._id.split('/').pop(), 
    count: item.count 
  })) || [];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-neon shadow-[0_0_8px_var(--success)]"></div>
            <span className="text-[10px] font-black text-success uppercase tracking-[0.3em]">System Status: Operational</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            SOC INTELLIGENCE ENGINE
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl font-medium">Real-time heuristics and forensic metrics for honeypot-based intrusion detection.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="glass-card px-5 py-3 flex items-center gap-4 border-white/5">
              <div className="text-right">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Watchers</div>
                <div className="text-lg font-bold text-white leading-tight">{stats.totalFiles}</div>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg"><Monitor className="w-5 h-5 text-primary" /></div>
           </div>
           <div className="glass-card px-5 py-3 flex items-center gap-4 border-danger/10">
              <div className="text-right">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Breach Events</div>
                <div className="text-lg font-bold text-danger leading-tight">{stats.unreadAlerts}</div>
              </div>
              <div className="p-2 bg-danger/10 rounded-lg"><Zap className="w-5 h-5 text-danger" /></div>
           </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monitored Assets"
          value={stats.totalFiles}
          icon={FileText}
          trend="+4.2%"
          colorClass={{ text: 'text-primary', bg: 'bg-primary', iconBg: 'bg-primary/5', border: 'border-primary/10' }}
          delay={0}
        />
        <StatCard
          title="Honeypot Traps"
          value={stats.trapFiles}
          icon={ShieldCheck}
          trend="Secure"
          colorClass={{ text: 'text-success', bg: 'bg-success', iconBg: 'bg-success/5', border: 'border-success/10' }}
          delay={100}
        />
        <StatCard
          title="Security Incidents"
          value={stats.suspiciousActivities}
          icon={Activity}
          trend="+12%"
          colorClass={{ text: 'text-warning', bg: 'bg-warning', iconBg: 'bg-warning/5', border: 'border-warning/10' }}
          delay={200}
        />
        <StatCard
          title="Unresolved Breaches"
          value={stats.unreadAlerts}
          icon={AlertTriangle}
          trend="Critical"
          colorClass={{ text: 'text-danger', bg: 'bg-danger', iconBg: 'bg-danger/5', border: 'border-danger/10' }}
          delay={300}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8 border-white/[0.03]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Threat Vectors Timeline</h3>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-1">Activity distribution over 7 days</p>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/50"></div>
                 <span className="text-[10px] font-bold text-gray-400">ACCESS DENSITY</span>
              </div>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#333" tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 border-white/[0.03]">
            <h3 className="text-xl font-bold text-white tracking-tight mb-8 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" /> Incident Command Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    <th className="pb-4">Interceptor Target</th>
                    <th className="pb-4">Vector</th>
                    <th className="pb-4">Source Identity</th>
                    <th className="pb-4 text-right">Time Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {stats.recentActivity?.map((activity) => (
                    <tr key={activity._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 ${activity.isSuspicious ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                              <FileText className="w-4 h-4" />
                           </div>
                           <span className="text-sm font-bold text-gray-200">{activity.fileName}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider ${
                          activity.action === 'delete' ? 'text-danger bg-danger/5 border border-danger/10' :
                          activity.action === 'edit' ? 'text-warning bg-warning/5 border border-warning/10' :
                          'text-primary bg-primary/5 border border-primary/10'
                        }`}>
                          {activity.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-5 text-sm font-medium text-gray-500">
                        {activity.userName} <span className="text-[10px] opacity-40 ml-1">[{activity.ipAddress}]</span>
                      </td>
                      <td className="py-5 text-right text-xs font-mono text-gray-600">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour12: false })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 border-white/[0.03] bg-gradient-to-br from-[#0d0d12] to-transparent">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
               <Zap className="w-5 h-5 text-warning" /> High Risk Assets
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} width={80} tick={{ fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--danger)' : 'var(--primary)'} fillOpacity={1 - index * 0.15} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
               <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Highest Severity Target</div>
               <div className="text-sm font-bold text-danger">{barData[0]?.name || 'N/A'}</div>
            </div>
          </div>

          <div className="glass-card p-8 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sentinel Shield</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">Autonomous file integrity monitoring is active. All interactions with decoy assets are being recorded for forensic analysis.</p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0d0d12] bg-dark-800 flex items-center justify-center text-[10px] font-bold text-primary`}>S{i}</div>)}
               </div>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">3 Active Nodes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
