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

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/50 border-b border-dark-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Path</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {files.map(file => (
              <tr key={file._id} className="hover:bg-dark-800/20 transition-colors">
                <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                  <Shield className={`w-4 h-4 ${file.type === 'honeypot' ? 'text-danger-main' : 'text-primary-main'}`} />
                  {file.name}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm truncate max-w-xs" title={file.path}>{file.folder}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${file.type === 'honeypot' ? 'bg-danger-main/10 text-danger-main border border-danger-main/20' : 'bg-dark-700 text-gray-300'}`}>
                    {file.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse-fast"></span>
                    <span className="text-sm text-gray-400">Monitoring</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleDelete(file._id)} className="text-gray-500 hover:text-danger-main transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                   No files currently monitored. Add one to get started.
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
