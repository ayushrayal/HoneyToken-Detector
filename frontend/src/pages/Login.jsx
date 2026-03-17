import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // navigation handled by AuthRouter
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-[460px] animate-slide-in relative z-10">
        <div className="glass-card p-10 md:p-12 relative overflow-hidden border-white/[0.08]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="flex flex-col items-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#11111a] to-[#0a0a0f] rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl border border-white/5 ring-4 ring-primary/10 relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <Shield className="w-12 h-12 text-primary relative z-10 filter drop-shadow-[0_0_8px_var(--primary)]" />
            </div>
            
            <h2 className="text-4xl font-extrabold text-white tracking-tighter text-center">
              HoneyToken Sentinel
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-[1px] w-6 bg-primary/30"></div>
              <p className="text-primary/70 text-[10px] font-black uppercase tracking-[0.4em]">HoneyToken Sentinel — v3.0</p>
              <div className="h-[1px] w-6 bg-primary/30"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary/60" /> Authenticator Identity
              </label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input h-14 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                  placeholder="admin@sentinel.hq"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3 text-primary/60" /> Cryptographic Token
                </label>
                <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-black text-primary/70 uppercase tracking-widest hover:text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input h-14 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 btn-primary rounded-2xl text-base font-bold uppercase tracking-widest group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span>{loading ? 'Initializing Interface...' : 'Grant Access'}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Don't have clearance? {' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Register as Sentinel
              </Link>
            </p>
          </div>
          
          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
               <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Protocol Secured: 256-BIT END-TO-END</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center space-y-3 opacity-40 hover:opacity-100 transition-all duration-500">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          <p className="text-[9px] text-gray-700 font-medium px-12">
            Warning: This system is for the use of authorized users only. Individuals using this computer system without authority or in excess of their authority are subject to having all of their activities monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
