import React, { useState, useEffect } from 'react';
import { ActivitySquare, Download, Filter, Search } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/activity');
        setLogs(res.data);
      } catch (err) {
        toast.error('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ActivitySquare className="w-6 h-6 text-primary-main" />
            Activity Logs
          </h1>
          <p className="text-gray-400 text-sm mt-1">Detailed audit trail of all file accesses</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-primary-main transition-colors" />
            <input 
              type="text" 
              placeholder="Search forensic logs..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="glass-input pl-10 w-72 text-sm focus:ring-1 focus:ring-primary-main/50"
            />
          </div>
          <button className="btn-primary bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white border border-dark-600">
            <Filter className="w-4 h-4" />
          </button>
          <button className="btn-primary bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white border border-dark-600">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/50 border-b border-dark-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Device Info</th>
              <th className="px-6 py-4 text-right">Duration (s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {filteredLogs.map(log => (
              <tr key={log._id} className="hover:bg-dark-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {log.fileName}
                  {log.fileType === 'honeypot' && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-danger-main/20 text-danger-main uppercase border border-danger-main/30">Trap</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                    log.action === 'delete' ? 'bg-danger-main/10 text-danger-main border border-danger-main/20' :
                    log.action === 'edit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                    log.action === 'download' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-gray-200">{log.userName}</div>
                  <div className="text-xs text-gray-500">{log.ipAddress}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]" title={log.deviceInfo}>
                  {log.deviceInfo}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-400 font-mono">
                  {log.duration}s
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  {loading ? 'Loading logs...' : 'No activity logs found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
