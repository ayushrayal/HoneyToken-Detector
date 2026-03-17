import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, ActivitySquare, Bell, Settings, LogOut, X, AlertCircle, Info } from 'lucide-react';
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
    { path: '/about', icon: Info, label: 'About' },
  ];

  return (
    <aside className="w-72 bg-[#08080a] border-r border-[#1a1a20] flex flex-col h-full shadow-[20px_0_50px_rgba(0,0,0,0.5)] relative z-20">
      <div className="h-24 flex flex-col justify-center px-8 border-b border-[#1a1a20] bg-gradient-to-b from-[#0d0d12] to-transparent">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-primary mr-3 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-xl font-bold tracking-tight text-white">
            HoneyToken Sentinel
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[2px] w-3 bg-primary/40"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">HoneyToken Sentinel — v3.0</span>
        </div>
      </div>

      <div className="p-6 border-b border-[#1a1a20]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/5 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Level 4 Clearance</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-primary/5 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r-full shadow-[0_0_8px_var(--primary)]"></div>}
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-3.5 transition-all duration-300 ${isActive ? 'filter drop-shadow-[0_0_5px_var(--primary)]' : 'group-hover:text-white'} ${item.path === '/alerts' && item.badge > 0 ? 'text-danger animate-neon' : ''}`} />
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`bg-danger text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.4)]`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-[#1a1a20]">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center w-full px-4 py-3.5 text-sm font-bold text-gray-500 rounded-xl hover:bg-danger/10 hover:text-danger transition-all group"
        >
          <LogOut className="w-5 h-5 mr-3.5 transition-transform group-hover:-translate-x-1" />
          Terminate Session
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
