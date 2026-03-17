import React, { useState, useContext } from 'react';
import { Shield, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('If an account exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-[460px] animate-slide-in relative z-10">
        <div className="glass-card p-10 md:p-12 border-white/[0.08]">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </Link>

          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#11111a] to-[#0a0a0f] rounded-3xl flex items-center justify-center mb-6 border border-white/5 ring-4 ring-primary/10">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tighter text-center">Reset Access</h2>
            <p className="text-gray-500 text-xs mt-2 font-medium text-center">Enter your identity to receive a decryption link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary/60" /> Registered Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 btn-primary rounded-xl text-sm font-bold uppercase tracking-widest group relative overflow-hidden"
            >
              <span>{loading ? 'Processing...' : 'Send Reset Link'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
