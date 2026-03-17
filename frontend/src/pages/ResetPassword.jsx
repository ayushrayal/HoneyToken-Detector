import React, { useState, useContext } from 'react';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password updated successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
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
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#11111a] to-[#0a0a0f] rounded-3xl flex items-center justify-center mb-6 border border-white/5 ring-4 ring-primary/10">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tighter text-center">New Security Token</h2>
            <p className="text-gray-500 text-xs mt-2 font-medium text-center">Update your cryptographic access key</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary/60" /> New Password
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary/60" /> Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input h-12 bg-white/[0.02] border-white/5 text-sm font-medium tracking-wide placeholder:text-gray-700"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 btn-primary rounded-xl text-sm font-bold uppercase tracking-widest group relative overflow-hidden"
            >
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
