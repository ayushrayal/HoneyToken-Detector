import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, Monitor } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#050507]">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-10 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-neon shadow-[0_0_8px_var(--primary)]"></div> 
              Security Intelligence Protocol v3.0
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10 animate-fade-in-up">
              AI POWERED <br/>
              <span className="text-primary italic filter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">HONEYTOKEN</span> <br/>
              DEFENSE.
            </h1>
            
            <p className="max-w-3xl mx-auto lg:mx-0 text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mb-14 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Detect intruders instantly with intelligent honeypot traps, 
              <span className="text-white"> forensic screenshots</span>, and real-time threat alerts powered by deceptive security engineering.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link to="/login" className="h-16 px-12 bg-primary text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center group active:scale-95 shadow-xl shadow-primary/10">
                Get Started
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="h-16 px-10 border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center backdrop-blur-sm group active:scale-95 text-gray-400 hover:text-white">
                View Console
              </Link>
            </div>
          </div>
        </div>

        {/* Stats / Badges */}
        <div className="mt-32 pt-12 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Verified Defense</span>
          </div>
          <div className="flex items-center gap-3">
             <Zap className="w-5 h-5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Intelligent Engine</span>
          </div>
          <div className="flex items-center gap-3">
             <Monitor className="w-5 h-5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Forensic Suite</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="w-5 h-5 rounded-md border border-primary/40 flex items-center justify-center text-[8px] font-bold text-primary">IO</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Real-time Stream</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
