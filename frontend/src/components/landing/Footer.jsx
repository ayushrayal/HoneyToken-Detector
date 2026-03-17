import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Zap, Cpu, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050507] pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <span className="text-xl font-black text-white tracking-tighter uppercase italic">HoneyToken Sentinel</span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs mb-8">
              Next-generation cognitive security infrastructure specialized in advanced deceptive technologies and proactive forensic attribution.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary/20 cursor-pointer transition-all">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary/20 cursor-pointer transition-all">
                <Zap className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary/20 cursor-pointer transition-all">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Platform</h4>
             <ul className="space-y-4">
               {['Monitors', 'Alert Engine', 'Forensics', 'AI Rules'].map((item) => (
                 <li key={item} className="text-xs font-bold text-gray-600 hover:text-white transition-colors cursor-pointer">{item}</li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Resources</h4>
             <ul className="space-y-4">
               {['Docs', 'API Lib', 'Whitepaper', 'Security'].map((item) => (
                 <li key={item} className="text-xs font-bold text-gray-600 hover:text-white transition-colors cursor-pointer">{item}</li>
               ))}
             </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
             <div className="glass-card p-6 border-white/5 bg-white/[0.01]">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5 text-primary" /> Sentinel Updates
                </h4>
                <p className="text-[10px] text-gray-500 font-medium mb-4">Subscribe to our intelligence feed for the latest in cyber deception.</p>
                <div className="relative group">
                   <input type="email" placeholder="SEC-IDENTITY@DOMAIN.IO" className="w-full bg-black/40 border border-white/5 rounded-xl h-11 px-4 text-[10px] font-bold text-white focus:outline-none focus:border-primary transition-colors" />
                   <button className="absolute right-1 top-1 h-9 px-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">Join</button>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} HoneyToken Sentinel Systems. Protocol Alpha Established.
          </div>
          <div className="flex items-center gap-8 opacity-40">
             <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-widest leading-none">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div> Operations Green
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black text-white uppercase tracking-widest leading-none">
                <div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Threat Level 4
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
