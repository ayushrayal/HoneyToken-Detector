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

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <div className={`glass-card p-6 flex flex-col justify-between relative overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20 ${colorClass.bg}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl border ${colorClass.border} ${colorClass.iconBg}`}>
        <Icon className={`w-6 h-6 ${colorClass.text}`} />
      </div>
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
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
       setStats(prev => ({
         ...prev,
         unreadAlerts: prev.unreadAlerts + 1,
         trapFiles: alert.severity === 'critical' ? prev.trapFiles : prev.trapFiles,
         recentActivity: [alert, ...(prev.recentActivity || [])].slice(0, 10)
       }));
       toast.error(`SECURITY BREACH: ${alert.fileName} accessed!`);
    };

    const handleActivity = (activity) => {
       setStats(prev => ({
         ...prev,
         suspiciousActivities: prev.suspiciousActivities + 1,
         recentActivity: [activity, ...(prev.recentActivity || [])].slice(0, 10),
         // Optionally update chart data here if feasible
       }));
    };

    socket.on('newAlert', handleNewAlert);
    socket.on('activityUpdate', handleActivity);

    return () => {
      socket.off('newAlert', handleNewAlert);
      socket.off('activityUpdate', handleActivity);
    };
  }, [socket]);

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  // Format data for Recharts
  const areaData = stats.activityTimeline?.map(item => ({
    name: item._id, // short date mm-dd
    accesses: item.count
  })) || [];

  const barData = stats.topAttackedFiles?.map(item => ({
    name: item._id.substring(0, 15) + (item._id.length > 15 ? '...' : ''),
    views: item.count
  })) || [];

  const lineData = stats.alertsPerHour?.map(item => ({
    hour: `${item._id}:00`,
    alerts: item.count
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Security Intelligence Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time honeypot monitoring and attack surface metrics</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">System Live</span>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monitored Files"
          value={stats.totalFiles}
          icon={FileText}
          colorClass={{ text: 'text-primary-main', bg: 'bg-primary-main', iconBg: 'bg-primary-main/10', border: 'border-primary-main/20' }}
          delay={0}
        />
        <StatCard
          title="Active Trap Files"
          value={stats.trapFiles}
          icon={ShieldAlert}
          colorClass={{ text: 'text-success', bg: 'bg-success', iconBg: 'bg-success/10', border: 'border-success/20' }}
          delay={100}
        />
        <StatCard
          title="Suspicious Activities"
          value={stats.suspiciousActivities}
          icon={Activity}
          colorClass={{ text: 'text-orange-500', bg: 'bg-orange-500', iconBg: 'bg-orange-500/10', border: 'border-orange-500/20' }}
          delay={200}
        />
        <StatCard
          title="Critical Alerts"
          value={stats.unreadAlerts}
          icon={AlertTriangle}
          colorClass={{ text: 'text-danger-main', bg: 'bg-danger-main', iconBg: 'bg-danger-main/10', border: 'border-danger-main/20' }}
          delay={300}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Alerts per Hour Trend */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Alert Intensity (24h)</h3>
            <span className="text-xs font-medium text-danger-main bg-danger-main/10 px-2 py-1 rounded border border-danger-main/20">Live Trend</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="hour" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#111111' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Attacked Files Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Targeted Assets</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="#a3a3a3" fontSize={11} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} opacity={1 - index * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Timeline Section (Secondary) */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">System Access Frequency (7 Days)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#262626', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="accesses" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAcc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="glass-card p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Suspicious Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-700 text-sm text-gray-400">
                <th className="pb-3 font-medium">File</th>
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">User / IP</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity?.map((activity) => (
                <tr key={activity._id} className="border-b border-dark-700/50 hover:bg-dark-800/30 transition-colors group">
                  <td className="py-4 text-sm text-gray-200">
                    <span className="flex items-center gap-2">
                       <FileText className={`w-4 h-4 ${activity.isSuspicious ? 'text-danger-main' : 'text-primary-main'}`} />
                       {activity.fileName}
                    </span>
                  </td>
                  <td className="py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      activity.action === 'delete' ? 'bg-danger-main/10 text-danger-main border border-danger-main/20' :
                      activity.action === 'edit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      activity.action === 'download' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {activity.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-400">
                    {activity.userName} <span className="opacity-50">({activity.ipAddress})</span>
                  </td>
                  <td className="py-4 text-sm text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {stats.recentActivity?.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">
                    No recent activity detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
