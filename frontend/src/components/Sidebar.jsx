import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, ActivitySquare, Bell, Settings, LogOut, X, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ unreadCount }) => {
  const { user, logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/monitor', icon: Shield, label: 'File Monitor' },
    { path: '/logs', icon: ActivitySquare, label: 'Activity Logs' },
    { path: '/alerts', icon: Bell, label: 'Alerts', badge: unreadCount },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-dark-800/50 backdrop-blur-xl border-r border-dark-700/50 flex flex-col h-full shadow-2xl relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-dark-700/50">
        <Shield className="w-8 h-8 text-primary-main mr-3" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Nxtzen
        </span>
      </div>

      <div className="p-4 border-b border-dark-700/50">
        <div className="text-sm font-medium text-gray-300">{user?.name || 'Admin'}</div>
        <div className="text-xs text-gray-500">{user?.email}</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-primary-main/10 text-primary-main border border-primary-main/20 shadow-[inset_0px_0px_10px_rgba(59,130,246,0.1)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
              }
            `}
          >
            <div className="flex items-center">
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${item.path === '/alerts' && item.badge > 0 ? 'text-danger-main animate-pulse' : ''}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="bg-danger-main text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dark-700/50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-danger-main/10 hover:text-danger-main transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 shadow-2xl border-white/5 animate-scale-up">
            <div className="flex items-center gap-3 mb-4 text-danger-main">
              <div className="p-2 bg-danger-main/10 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to terminate your current session? You will need to re-authenticate to access the dashboard.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-dark-700 text-gray-300 font-medium hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-danger-main text-white font-medium hover:bg-danger-hover shadow-[0_4px_15px_rgba(239,68,68,0.3)] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
