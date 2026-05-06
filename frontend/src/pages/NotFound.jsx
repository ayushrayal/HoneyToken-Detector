import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-main/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger-main/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 bg-dark-800 rounded-3xl border border-dark-700 flex items-center justify-center shadow-2xl"
            >
              <ShieldAlert size={64} className="text-danger-main" />
            </motion.div>
            <div className="absolute -top-2 -right-2 bg-danger-main text-white p-2 rounded-full shadow-lg border-4 border-dark-950">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">
          404
        </h1>
        
        <div className="inline-block px-4 py-1 rounded-full bg-danger-main/10 border border-danger-main/20 text-danger-main text-sm font-bold uppercase tracking-widest mb-6">
          Security Breach: Page Not Found
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Access Denied or Missing Resource
        </h2>
        
        <p className="text-gray-400 mb-10 leading-relaxed">
          The asset you are looking for has been moved, deleted, or never existed in the first place. 
          Our sensors indicate you've wandered into an unmonitored zone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-bold border border-dark-700 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-main hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary-main/20 transition-all active:scale-95"
          >
            <Home size={20} />
            Return to HQ
          </button>
        </div>
      </motion.div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default NotFound;
