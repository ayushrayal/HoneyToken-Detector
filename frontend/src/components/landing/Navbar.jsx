import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-[#050507]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-7'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Shield className="w-9 h-9 text-primary filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none">HONEYTOKEN</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-0.5">Sentinel v3.0</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          {['Features', 'Forensics', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all hover:tracking-[0.3em]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="h-12 px-8 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 flex items-center">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button 
                onClick={logout}
                className="h-12 px-8 border border-white/5 bg-white/[0.02] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-[#050507] z-50 p-8 animate-fade-in">
          <div className="flex flex-col gap-8">
            {['Features', 'Forensics', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black text-white tracking-tighter"
              >
                {item}
              </a>
            ))}
            <div className="h-px bg-white/5 w-full"></div>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-400">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="h-14 bg-white text-black flex items-center justify-center rounded-2xl font-black uppercase tracking-widest">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-primary">Dashboard</Link>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="h-14 bg-danger/10 text-danger flex items-center justify-center rounded-2xl font-black uppercase tracking-widest"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
