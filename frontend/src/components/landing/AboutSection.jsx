import React from 'react';
import { Shield, Lock, Bell, Activity, Database, Cpu, Globe, Zap, CheckCircle, Info, ShieldCheck, Target, Terminal, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const steps = [
    { title: "Deploy Traps", desc: "Strategic HoneyTokens are deployed across critical infrastructure.", icon: Target },
    { title: "Intruder Trigger", desc: "Unauthorized access triggers a silent forensic capture sequence.", icon: Zap },
    { title: "Evidence Capture", desc: "System captures desktop snapshots and webcam telemetry.", icon: ShieldCheck },
    { title: "Instant Alert", desc: "Security teams are notified immediately via socket and email.", icon: Bell }
  ];

  const tech = [
    { name: "React", icon: Cpu },
    { name: "Node.js", icon: Activity },
    { name: "MongoDB", icon: Database },
    { name: "Puppeteer", icon: Globe },
    { name: "Socket.IO", icon: Zap },
    { name: "Express", icon: Terminal }
  ];

  return (
    <section id="about" className="py-32 bg-[#050507] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
              <Shield className="w-3 h-3" /> Mission Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              THE FUTURE OF <br/>
              <span className="text-primary italic">DECEPTIVE</span> <br/>
              CYBER DEFENSE.
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              HoneyToken Sentinel focuses on the data itself rather than just perimeters. 
              By placing indistinguishable "fake" files—HoneyTokens—throughout your network, 
              we create a proactive early warning system that catches attackers where they least expect it.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
              {tech.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                   <t.icon className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                   <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 border-white/5 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-40 h-40 text-primary" />
             </div>
             <h3 className="text-2xl font-black text-white mb-10 border-b border-white/5 pb-6 flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-primary" /> System Workflow
             </h3>
             
             <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                     <div className="relative flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <step.icon className="w-5 h-5" />
                        </div>
                        {i !== steps.length - 1 && <div className="w-px h-10 bg-white/5 my-2"></div>}
                     </div>
                     <div className="pt-1">
                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{step.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{step.desc}</p>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-12 flex justify-center">
                <div className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                   Autonomous Protection Active <Shield className="w-3 h-3" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
