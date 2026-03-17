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
        toast.error('Audit trail communication failure');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm)
  );

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
               <ActivitySquare className="w-8 h-8 text-primary" />
            </div>
            AUDIT TRAIL
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Heuristic logging for file interaction forensics.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search forensic records..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="glass-input pl-12 w-80 text-sm h-12 bg-white/[0.02] border-white/5"
            />
          </div>
          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="h-12 px-6 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:filter hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Forensic Timestamp</th>
                <th className="px-8 py-5">Target Asset</th>
                <th className="px-8 py-5">Interaction Vector</th>
                <th className="px-8 py-5">Subject Identity</th>
                <th className="px-8 py-5 text-right">Delta (s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredLogs.map((log, idx) => (
                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group animate-slide-in" style={{ animationDelay: `${idx * 20}ms` }}>
                  <td className="px-8 py-6 whitespace-nowrap text-xs font-mono font-bold text-gray-500 group-hover:text-primary-light transition-colors">
                    {new Date(log.timestamp).toLocaleString([], { hour12: false })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-bold text-gray-200 tracking-tight">{log.fileName}</span>
                       {log.fileType === 'honeypot' && (
                         <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black bg-danger/10 text-danger uppercase border border-danger/20 animate-neon">
                           TRAP
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                      log.action === 'delete' ? 'bg-danger/10 text-danger border-danger/20' :
                      log.action === 'edit' ? 'bg-warning/10 text-warning border-warning/20' :
                      log.action === 'download' ? 'bg-accent/10 text-accent border-accent/20' :
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-200">{log.userName}</span>
                      <span className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-widest mt-0.5">{log.ipAddress}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-right text-gray-500 font-mono font-bold">
                    {log.duration || '0.00'}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center mb-4 border border-white/5 opacity-50">
                          <ActivitySquare className="w-8 h-8 text-gray-600" />
                       </div>
                       <p className="text-sm font-bold text-gray-500/50 uppercase tracking-widest">
                          {loading ? 'Decrypting Forensic Logs...' : 'Intelligence Feed Null'}
                       </p>
                    </div>
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

export default Logs;
