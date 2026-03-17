import React, { useState, useContext } from 'react';
import { Shield, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(username, email, password);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#11111a] to-[#0a0a0f] rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/5 ring-4 ring-primary/10 relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <Shield className="w-10 h-10 text-primary relative z-10 filter drop-shadow-[0_0_8px_var(--primary)]" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tighter text-center">
              Create Account
            </h2>
            <p className="text-gray-500 text-xs mt-2 font-medium">Join the Sentinel Intelligence Network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-primary/60" /> Operation Alias
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input h-12 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                placeholder="Agent Hunter"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary/60" /> Secure Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input h-12 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                placeholder="agent@sentinel.hq"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary/60" /> Security Token
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input h-12 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 btn-primary rounded-xl text-sm font-bold uppercase tracking-widest group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span>{loading ? 'Initializing...' : 'Initialize Profile'}</span>
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Already a sentinel? {' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Grant Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
