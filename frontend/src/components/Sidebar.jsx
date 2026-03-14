import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, ActivitySquare, Bell, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ unreadCount }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
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
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-danger-main/10 hover:text-danger-main transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
