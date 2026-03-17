import React, { useContext, useState } from 'react';
import { Settings as SettingsIcon, Mail, Shield, Server, Database, Info, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [isSending, setIsSending] = useState(false);

  const handleTestEmail = async () => {
    setIsSending(true);
    try {
      const response = await api.post('/settings/test-email');
      if (response.data.success) {
        toast.success(response.data.message || 'Test email sent successfully.', {
          icon: <CheckCircle2 className="text-success w-5 h-5" />,
          style: { background: '#0d0d12', color: '#fff', border: '1px solid rgba(34, 197, 94, 0.2)' }
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Test email error:', err);
      toast.error(err.response?.data?.message || 'Failed to send email. Check SMTP configuration.', {
        icon: <AlertCircle className="text-danger w-5 h-5" />,
        style: { background: '#0d0d12', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.2)' }
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
               <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            CORE PREFERENCES
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Configure HoneyToken Sentinel intelligence parameters.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Profile Settings */}
        <section className="glass-card p-10 relative overflow-hidden group border-white/[0.03]">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
             <Shield className="w-40 h-40 text-primary" />
          </div>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
               <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white tracking-tight">Access Identifier</h2>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Administrator Profile Details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Command Name</label>
              <input type="text" readOnly value={user?.name || ''} className="glass-input bg-white/[0.01] border-white/5 cursor-not-allowed text-white font-bold" />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Secure Email Identity</label>
              <input type="email" readOnly value={user?.email || ''} className="glass-input bg-white/[0.01] border-white/5 cursor-not-allowed text-white/50" />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Clearance Level</label>
              <div className="glass-input bg-white/[0.01] border-primary/20 text-primary font-black uppercase tracking-widest flex items-center justify-between">
                 <span>Level 5 (Admin Override)</span>
                 <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {/* System Settings */}
          <section className="glass-card p-8 border-white/[0.03]">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-warning/10 rounded-xl border border-warning/20">
                 <Server className="w-5 h-5 text-warning" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">SOC Intelligence Engine</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex justify-between items-center group">
                <div>
                  <h4 className="text-white font-bold text-sm">Real-time Telemetry</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Bi-directional WebSocket link is operational.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-primary animate-neon shadow-[0_0_8px_var(--primary)]"></div>
                </div>
              </div>
              
              <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex justify-between items-center opacity-60">
                <div>
                  <h4 className="text-white/60 font-bold text-sm">Auto-Purge Forensics</h4>
                  <p className="text-[10px] text-gray-600 font-medium mt-1">Logs transition to cold storage after 90 days.</p>
                </div>
                <div className="w-8 h-4 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </section>

          {/* Email Alert Settings */}
          <section className="glass-card p-8 border-white/[0.03] relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <Mail className="w-48 h-48 text-accent" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                   <Mail className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">Notification Channels</h2>
              </div>
              <button 
                onClick={handleTestEmail}
                disabled={isSending}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isSending 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'bg-accent text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95'
                }`}
              >
                {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {isSending ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
            
            <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl mb-8 flex gap-4">
               <Info className="w-5 h-5 text-accent shrink-0" />
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                 SMTP configuration and alert recipients are managed via <span className="text-white italic">environment variables</span>. 
                 Recipient Email: <span className="text-accent underline decoration-accent/30 underline-offset-4">nxtzen.co@gmail.com</span>
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Service</label>
                <div className="glass-input h-12 bg-black/20 border-white/5 text-xs font-bold text-gray-400 flex items-center">GMAIL (NODE-WATCHER)</div>
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Forensic Attachment</label>
                <div className="glass-input h-12 bg-black/20 border-white/5 text-xs font-bold text-white flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]"></div> Puppeteer Snapshot
                </div>
              </div>
            </div>

            {/* Sub-sections for SMTP and Monitoring */}
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative z-10">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4 text-accent" /> SMTP Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">SMTP Host</label>
                    <input type="text" readOnly value="smtp.gmail.com" className="glass-input py-2 text-xs bg-black/20 border-white/5 text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">SMTP Port</label>
                    <input type="text" readOnly value="587" className="glass-input py-2 text-xs bg-black/20 border-white/5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative z-10">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-warning" /> System Monitoring
                </h4>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-400 font-medium">Auto-Snapshot on Incident</span>
                  <div className="w-8 h-4 bg-primary/20 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
