import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit, X, CheckCircle, Info, HelpCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Monitor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    folder: '',
    type: 'normal',
    alertOnAccess: true,
    alertOnEdit: true
  });

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (err) {
      toast.error('Asset directory communication failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/files', formData);
      toast.success('Asset trajectory initialized');
      setShowForm(false);
      setFormData({ name: '', path: '', folder: '', type: 'normal', alertOnAccess: true, alertOnEdit: true });
      fetchFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol initialization failure');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Terminate monitoring for this asset?')) return;
    try {
      await api.delete(`/files/${id}`);
      toast.success('Asset purged from perimeter');
      fetchFiles();
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
               <Shield className="w-8 h-8 text-primary" />
            </div>
            ASSET DEFENSE
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Manage Honeytoken traps and monitored secure assets.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="h-14 px-8 rounded-2xl bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel Operation' : 'Deploy Tracker'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-10 border-white/10 animate-scale-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Plus className="w-40 h-40 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-4">INITIATE TRACKING PROTOCOL</h3>
          
          <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Configuration Instructions</p>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Enter the full path of the file or folder you want to monitor. The system will monitor this file and trigger an alert if it is opened, edited, or deleted.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  Asset Name (Identifier)
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-600 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                      A unique name to identify this honeytoken or asset in your dashboard.
                    </div>
                  </div>
                </label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input h-14 bg-white/[0.02] border-white/5" placeholder="e.g. Master_Keys.vault" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Classification</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="glass-input h-14 bg-white/[0.02] border-white/5 appearance-none">
                  <option value="normal">Standard (Audit Monitoring)</option>
                  <option value="honeypot">Honeytoken (Decoy Trap)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Parent Directory</label>
                <input required value={formData.folder} onChange={e => setFormData({...formData, folder: e.target.value})} className="glass-input h-14 bg-white/[0.02] border-white/5" placeholder="C:\Users\Admin\Documents" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  Absolute Forensic Path
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-600 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-white/10 rounded-lg text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                      <p className="mb-2 text-white">EXAMPLES BY OS:</p>
                      <ul className="space-y-1">
                        <li>Windows: C:\Users\John\Desktop\confidential.xlsx</li>
                        <li>Linux: /home/user/documents/secret.txt</li>
                        <li>Mac: /Users/username/Documents/secret.txt</li>
                      </ul>
                    </div>
                  </div>
                </label>
                <input 
                  required 
                  value={formData.path} 
                  onChange={e => setFormData({...formData, path: e.target.value})} 
                  className="glass-input h-14 bg-white/[0.02] border-white/5" 
                  placeholder="C:\Users\John\Desktop\confidential.xlsx" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${formData.alertOnAccess ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                   {formData.alertOnAccess && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <input type="checkbox" checked={formData.alertOnAccess} onChange={e => setFormData({...formData, alertOnAccess: e.target.checked})} className="hidden" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">TRIGGER ON ACCESS</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${formData.alertOnEdit ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                   {formData.alertOnEdit && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <input type="checkbox" checked={formData.alertOnEdit} onChange={e => setFormData({...formData, alertOnEdit: e.target.checked})} className="hidden" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">TRIGGER ON MUTATION</span>
              </label>
            </div>

            <div className="flex justify-end gap-6">
              <button type="submit" className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-sm tracking-widest uppercase hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                Validate & Deploy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden border-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Target Asset</th>
                <th className="px-10 py-6">Core Directory</th>
                <th className="px-10 py-6">Guardian Status</th>
                <th className="px-10 py-6 text-right">Perimeter Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {files.map((file, idx) => (
                <tr key={file._id} className="group hover:bg-white/[0.02] transition-colors animate-slide-in" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                        file.type === 'honeypot' 
                          ? 'bg-danger/10 border-danger/30 text-danger shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                          : 'bg-primary/10 border-primary/30 text-primary group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                      }`}>
                        <Shield className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                           <span className="text-lg font-black text-white tracking-tight">{file.name}</span>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border ${
                             file.type === 'honeypot' ? 'bg-danger text-white border-danger animate-neon' : 'bg-white/10 text-gray-400 border-white/10'
                           }`}>
                             {file.type}
                           </span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-bold font-mono mt-1.5 uppercase tracking-widest">{file.path}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter">
                        {file.folder || '/ROOT_SENTINEL'}
                     </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-[0_0_8px_var(--success)]"></span>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Surveillance</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleDelete(file._id)} 
                      className="w-12 h-12 rounded-xl bg-danger/5 text-danger/50 hover:bg-danger hover:text-white transition-all inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {files.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                     <div className="inline-flex items-center justify-center w-24 h-24 rounded-[40%] bg-white/[0.02] border border-white/5 mb-8 text-gray-700">
                        <Shield className="w-12 h-12" />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2 tracking-tight">DEFENSE PERIMETER NULL</h3>
                     <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium">No tracking protocols found. Deploy Honeytoken traps into critical directories to begin interaction detection.</p>
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

export default Monitor;
