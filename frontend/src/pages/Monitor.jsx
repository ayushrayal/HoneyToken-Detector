import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Monitor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
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
      toast.error('Failed to load monitored files');
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
      toast.success('File added to monitoring');
      setShowForm(false);
      setFormData({ name: '', path: '', folder: '', type: 'normal', alertOnAccess: true, alertOnEdit: true });
      fetchFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add file');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to stop monitoring this file?')) return;
    try {
      await api.delete(`/files/${id}`);
      toast.success('File removed properly');
      fetchFiles();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-dark-700 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">File Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">Manage honeytokens and monitored corporate files</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Tracker
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-l-4 border-l-primary-main mb-8 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">New Tracking Rule</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">File Name (e.g. Passwords.xlsx)</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Folder Path</label>
                <input required value={formData.folder} onChange={e => setFormData({...formData, folder: e.target.value})} className="glass-input" placeholder="/opt/shared/finance" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Absolute Path</label>
                <input required value={formData.path} onChange={e => setFormData({...formData, path: e.target.value})} className="glass-input" placeholder="/opt/shared/finance/Passwords.xlsx" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">File Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="glass-input appearance-none">
                  <option value="normal">Normal (Audit Only)</option>
                  <option value="honeypot">Honeypot (Triggers Alert)</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 pt-2 border-t border-dark-700 mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={formData.alertOnAccess} onChange={e => setFormData({...formData, alertOnAccess: e.target.checked})} className="rounded bg-dark-800 border-dark-600 text-primary-main focus:ring-primary-main" />
                Alert on Open/Read
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={formData.alertOnEdit} onChange={e => setFormData({...formData, alertOnEdit: e.target.checked})} className="rounded bg-dark-800 border-dark-600 text-primary-main focus:ring-primary-main" />
                Alert on Edit
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:bg-dark-700 transition-colors">Cancel</button>
              <button type="submit" className="btn-primary">Save Rule</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden relative border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-transparent pointer-events-none"></div>
        <table className="w-full text-left border-collapse relative z-10">
          <thead>
            <tr className="bg-dark-800/80 border-b border-dark-700 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <th className="px-6 py-5">Managed Asset</th>
              <th className="px-6 py-5">Core Directory</th>
              <th className="px-6 py-5">Classification</th>
              <th className="px-6 py-5">Guardian Status</th>
              <th className="px-6 py-5 text-right whitespace-nowrap">Control Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {files.map(file => (
              <tr key={file._id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${file.type === 'honeypot' ? 'bg-danger-main/10 text-danger-main' : 'bg-primary-main/10 text-primary-main'}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-tight">{file.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[200px]">{file.path}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="text-xs text-gray-400 bg-dark-800 px-2 py-1 rounded inline-block border border-dark-700">
                      {file.folder || '/root'}
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${
                    file.type === 'honeypot' ? 'bg-danger-main/10 text-danger-main border-danger-main/30' : 'bg-dark-700 text-gray-400 border-dark-600'
                  }`}>
                    {file.type}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Watch</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(file._id)} className="p-2 rounded-lg bg-danger-main/10 text-danger-main hover:bg-danger-main hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-dark-800 border border-dark-700 mb-4 text-gray-600">
                      <Shield className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-1">Defense Perimeter Empty</h3>
                   <p className="text-sm text-gray-500 max-w-xs mx-auto">No files are currently being monitored. Deploy a Honeypot to begin detection.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitor;
