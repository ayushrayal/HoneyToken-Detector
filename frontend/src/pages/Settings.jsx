import React, { useContext } from 'react';
import { Settings as SettingsIcon, Mail, Shield, Server, Database } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary-main" />
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configure Nxtzen Guardian preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <section className="glass-card p-6 border-l-4 border-l-primary-main">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary-main" />
            <h2 className="text-lg font-semibold text-white">Admin Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" readOnly value={user?.name || ''} className="glass-input bg-dark-800/50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" readOnly value={user?.email || ''} className="glass-input bg-dark-800/50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <input type="text" readOnly value={user?.role?.toUpperCase() || 'ADMIN'} className="glass-input bg-dark-800/50 cursor-not-allowed text-primary-main font-bold" />
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="glass-card p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-white">System Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700 flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">Real-time WebSockets</h4>
                <p className="text-sm text-gray-400 mt-1">Receive live alerts without refreshing.</p>
              </div>
              <div className="w-12 h-6 bg-primary-main rounded-full flex items-center px-1">
                <div className="w-4 h-4 rounded-full bg-white transform translate-x-6"></div>
              </div>
            </div>
            
            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700 flex justify-between items-center opacity-70">
              <div>
                <h4 className="text-white font-medium">Auto-purge Old Logs</h4>
                <p className="text-sm text-gray-400 mt-1">Delete logs older than 90 days. (Configured in .env)</p>
              </div>
              <div className="w-12 h-6 bg-dark-600 rounded-full flex items-center px-1 cursor-not-allowed">
                 <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Email Alert Settings */}
        <section className="glass-card p-6 border-l-4 border-l-success">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-success" />
            <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
          </div>
          
          <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-success/10 rounded-lgShrink-0">
                <Database className="w-5 h-5 text-success" />
              </div>
              <div>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   Email credentials (SMTP Server, Provider, App Password) are securely managed via the backend `.env` file to prevent client-side exposure. Target alert email address is currently statically mapped to <span className="text-primary-main font-mono">nxtzen.cog@gmail.com</span>.
                 </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Service</label>
              <input type="text" readOnly value="Gmail (Nodemailer)" className="glass-input bg-dark-800/50 cursor-not-allowed" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Attach Snapshot to Alert Email</label>
              <select disabled className="glass-input bg-dark-800/50 cursor-not-allowed appearance-none">
                <option>Enabled (Puppeteer)</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
