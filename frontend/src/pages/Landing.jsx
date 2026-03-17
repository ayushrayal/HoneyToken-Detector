import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import Footer from '../components/landing/Footer';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f3f4f6] font-sans selection:bg-primary/30 selection:text-white scroll-smooth flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Grid Section */}
        <FeaturesSection />

        {/* Forensic Showcase Section */}
        <section id="forensics" className="py-32 bg-[#050507] relative overflow-hidden border-y border-white/5">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                <div className="relative group p-1">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className="glass-card aspect-video rounded-3xl overflow-hidden border-white/10 relative z-10 p-2 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1470" 
                      alt="Cybersecurity Forensics" 
                      className="w-full h-full object-cover rounded-[1.5rem] opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0d0d12]/90 backdrop-blur-xl border border-white/5 rounded-2xl animate-fade-in">
                       <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_8px_var(--danger)]"></div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Threat Intelligence Capture</span>
                       </div>
                       <p className="text-white text-sm font-bold tracking-tight">Active incident verification via dual-channel forensics.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                   <ShieldCheck className="w-4 h-4" /> Attribution Suite
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                  WE DON'T JUST <br/>
                  <span className="text-primary italic">ALERT</span>. WE <br/>
                  CAPTURE.
                </h2>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  While traditional tools generate logs, we generate evidence. HoneyToken Sentinel captures 
                  high-resolution desktop snapshots and webcam photos the millisecond a trap is triggered.
                </p>
                <div className="space-y-6 pt-4">
                  {[
                    "Dual-Monitor Desktop Snapshots",
                    "Intruder Webcam Identity Capture",
                    "Hardware & OS Forensic Telemetry",
                    "Network Path & IP Geolocation Trace"
                  ].map((li, i) => (
                    <div key={i} className="flex items-center gap-4 text-white font-bold group">
                       <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                       </div>
                       {li}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* CTA Section */}
        <section className="py-32 bg-[#050507] relative overflow-hidden">
           <div className="max-w-6xl mx-auto px-6 md:px-10">
              <div className="glass-card p-20 rounded-[3rem] border-primary/20 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                 <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                 
                 <div className="relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter">
                       READY TO <br/> <span className="text-primary italic">DECEIVE?</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium mb-14">
                       Scale your security infrastructure with HoneyToken Sentinel v3.0. 
                       Deploy your first intelligent traps in under 5 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                       <Link to="/login" className="h-16 px-12 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl">
                          Deploy Now
                       </Link>
                       <a href="mailto:support@honeytoken.io" className="h-16 px-12 border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
                          Request Demo
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
