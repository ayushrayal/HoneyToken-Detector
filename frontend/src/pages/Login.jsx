import React, { useState, useContext } from 'react';
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
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-main/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger-main/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 transition-all duration-500 animate-fade-in">
        <div className="glass-card p-4 sm:p-10 border-t border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-dark-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-dark-700 ring-1 ring-primary-main/30 relative">
              <div className="absolute inset-0 bg-primary-main/5 rounded-3xl blur-md"></div>
              <Shield className="w-10 h-10 text-primary-main relative z-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">Nxtzen File Guardian</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-[1px] w-4 bg-primary-main/50"></div>
              <p className="text-primary-main/70 text-xs font-black uppercase tracking-[0.2em]">Secure Access Portal</p>
              <div className="h-[1px] w-4 bg-primary-main/50"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Credential Identifier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-main">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-12 h-14 border-dark-700 hover:border-dark-600 focus:border-primary-main/50 transition-all text-sm"
                  placeholder="admin@nxtzen.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Access Token</label>
                <button type="button" className="text-[10px] font-bold text-primary-main/50 hover:text-primary-main transition-colors uppercase tracking-widest">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-main">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-12 h-14 border-dark-700 hover:border-dark-600 focus:border-primary-main/50 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary-main hover:bg-primary-hover text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span>{loading ? 'Validating Presence...' : 'Initialize Session'}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-1 bg-dark-700"></div>
                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">or</span>
                <div className="h-[1px] flex-1 bg-dark-700"></div>
              </div>

              <button
                type="button"
                className="w-full h-12 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2 border border-dark-700 hover:border-dark-600 bg-white/0 hover:bg-white/[0.02]"
              >
                Contact Headquarters for Onboarding
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Secure Protocol v4.2</span>
          </div>
          <p className="text-gray-600 text-[10px] tracking-[0.1em] uppercase font-bold">
            Controlled Unclassified Information
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
