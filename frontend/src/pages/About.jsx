import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Shield, Lock, Bell, Activity, Database, Cpu, Globe, Zap, ShieldCheck, Target, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const steps = [
    { title: "Fake files are deployed", desc: "Strategically place indistinguishable HoneyTokens across your local and network drives.", icon: Target },
    { title: "Intruder accesses file", desc: "The second a deceptive file is interacted with, our silent watcher captures the event.", icon: Lock },
    { title: "System captures evidence", desc: "Autonomous forensic sequence records desktop snapshots and webcam identity data.", icon: ShieldCheck },
    { title: "Alert is triggered", desc: "Real-time notifications are broadcasted to administrators via multiple secure channels.", icon: Bell }
  ];

  const techStack = [
    { name: "React", icon: Cpu, category: "Frontend" },
    { name: "Node.js", icon: Activity, category: "Backend" },
    { name: "Express", icon: Terminal, category: "Server" },
    { name: "MongoDB", icon: Database, category: "Database" },
    { name: "Puppeteer", icon: Globe, category: "Forensics" },
    { name: "Socket.IO", icon: Zap, category: "Real-time" }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#f3f4f6] font-sans selection:bg-primary/30 scroll-smooth flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero / Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-32 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-10">
              <Shield className="w-3.5 h-3.5" /> Intelligence Protocol
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10">
              DECEPTIVE <br/> <span className="text-primary italic">SECURITY</span> <br/> ARCHITECTURE.
           </h1>
           <p className="max-w-2xl text-xl text-gray-500 font-medium leading-relaxed">
             HoneyToken Sentinel v3.0 is a next-generation security platform focused on data-centric protection through strategic deception infrastructure.
           </p>
        </div>

        {/* Mission Section */}
        <section className="py-32 border-y border-white/5 bg-[#08080a] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.2] pointer-events-none"></div>
           <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Our Mission</h2>
                    <p className="text-lg text-gray-400 font-medium leading-relaxed">
                       Traditional security often fails to detect intruders once they've bypassed the perimeter. Our mission is to transform your internal environment into a proactive defense zone. 
                    </p>
                    <p className="text-lg text-gray-400 font-medium leading-relaxed">
                       By deploying HoneyTokens that look and feel like actual corporate assets, we force attackers to reveal themselves the moment they attempt to access sensitive information.
                    </p>
                    <div className="pt-6">
                       <div className="flex items-center gap-4 text-white font-bold text-sm tracking-tight border-l-2 border-primary pl-6 py-2">
                          "The best way to catch a thief is to give them something to steal."
                       </div>
                    </div>
                 </div>
                 <div className="glass-card p-1 items-center justify-center hidden lg:flex">
                    <div className="w-full aspect-square bg-[#050507] rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden group">
                       <Shield className="w-40 h-40 text-primary opacity-20 filter blur-sm group-hover:blur-none transition-all duration-700" />
                       <div className="absolute inset-0 bg-primary/5 animate-pulse-slow"></div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 border-b border-white/5 relative">
           <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
              <div className="text-center mb-24">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6">System Workflow</h2>
                 <p className="text-gray-500 font-medium text-sm text-[10px] uppercase tracking-[0.3em]">Four layers of autonomous protection and forensic capture</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {steps.map((step, i) => (
                    <div key={i} className="glass-card p-10 flex flex-col items-center text-center group hover:border-primary/20 transition-all cursor-default relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <step.icon className="w-12 h-12 text-primary" />
                       </div>
                       <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative z-10">
                          <step.icon className="w-7 h-7" />
                       </div>
                       <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 italic relative z-10">Phase 0{i+1}</div>
                       <h3 className="text-lg font-bold text-white mb-4 tracking-tight relative z-10">{step.title}</h3>
                       <p className="text-[11px] text-gray-500 font-medium leading-relaxed relative z-10">{step.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Technology Stack */}
        <section className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
               <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                  <div className="max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6">Technology Stack</h2>
                    <p className="text-gray-500 font-medium text-sm">Built on industry-leading modern technologies for maximum performance and reliability.</p>
                  </div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                     Scalable Architecture <CheckCircle2 className="w-3 h-3" />
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {techStack.map((tech, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-8 glass-card border-white/[0.02] hover:border-primary/30 transition-all group">
                       <tech.icon className="w-8 h-8 text-gray-500 group-hover:text-primary transition-all group-hover:scale-110 duration-500 filter drop-shadow-[0_0_8px_currentColor]" />
                       <div className="text-sm font-bold text-white mt-6 mb-1 tracking-tight">{tech.name}</div>
                       <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tech.category}</div>
                    </div>
                  ))}
               </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="pt-20 px-6">
           <div className="max-w-5xl mx-auto glass-card p-16 rounded-[2.5rem] border-primary/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic">Stay Ahead of the Threat.</h2>
              <Link to="/login" className="inline-flex items-center gap-3 h-14 px-10 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-95">
                 Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
