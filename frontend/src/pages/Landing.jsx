import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Bell, Activity, ChevronRight, Zap, 
  Eye, CheckCircle, Database, ShieldAlert, Cpu, Globe 
} from 'lucide-react';

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans selection:bg-primary-main/30 scroll-smooth">
      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary-main relative z-10" />
              <div className="absolute inset-0 bg-primary-main/20 blur-lg rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tighter uppercase italic">Nxtzen</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Forensics</a>
            <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="btn-primary py-2 px-6 rounded-lg text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Abstract Background Components */}
        <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-primary-main/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-danger-main/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-dark-800 border border-dark-700 text-xs font-bold text-primary-main mb-8 animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-main opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-main"></span>
              </span>
              COGNITIVE FILE PROTECTION ENGINE V2.0
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] animate-fade-in-up">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main via-cyan-400 to-primary-main bg-[length:200%_auto] animate-gradient-flow">INVISIBLE</span> <br/>
              TRAP FOR <br/>
              DATA THIEVES.
            </h1>
            
            <p className="max-w-2xl text-xl text-gray-400 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Deploy AI-driven HoneyTokens across your network. Catch attackers the moment they touch your data with instant desktop snapshots and webcam forensic evidence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link to="/login" className="btn-primary group h-14 px-10 rounded-xl text-lg font-bold w-full sm:w-auto shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center">
                Get Started
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="h-14 px-10 rounded-xl text-lg text-white font-bold hover:bg-white/5 transition-all w-full sm:w-auto border border-white/10 flex items-center justify-center backdrop-blur-sm">
                How it works
              </a>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden xl:block animate-fade-in" style={{ animationDelay: '600ms' }}>
           <div className="relative p-8">
              <div className="glass-card aspect-video w-full rounded-2xl border-white/10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-danger-main/5"></div>
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger-main"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                 </div>
                 <div className="mt-12 px-6">
                    <div className="h-4 w-3/4 bg-white/5 rounded-full mb-4"></div>
                    <div className="h-4 w-1/2 bg-white/5 rounded-full mb-8"></div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                       <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                       <div className="h-24 bg-primary-main/20 rounded-xl border border-primary-main/30 animate-pulse"></div>
                    </div>
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute top-1/4 right-8 bg-danger-main p-3 rounded-xl shadow-2xl animate-bounce-slow">
                    <ShieldAlert className="w-8 h-8 text-white" />
                 </div>
                 <div className="absolute bottom-1/4 left-12 bg-dark-800 border border-success/30 p-3 rounded-xl shadow-2xl animate-float">
                    <CheckCircle className="w-6 h-6 text-success" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-dark-700/50 bg-dark-800/20">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-12">Engineered for Modern Security Infrastructures</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 text-2xl font-black text-white italic"><Database className="w-8 h-8" /> ORACLE.DB</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white italic"><Cpu className="w-8 h-8" /> INTEL.CORE</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white italic"><Globe className="w-8 h-8" /> GLOBAL.SEC</div>
             <div className="flex items-center gap-2 text-2xl font-black text-white italic"><Zap className="w-8 h-8" /> VOLT.TECH</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none">
                360° DECEPTION <br/>
                INFRASTRUCTURE.
              </h2>
              <p className="text-xl text-gray-400">Total visibility into who is accessing your sensitive internal assets.</p>
            </div>
            <div className="h-1 w-32 bg-primary-main hidden md:block rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldAlert, 
                title: "Undetectable Traps", 
                desc: "Generate files that appear indistinguishable from authentic corporate spreadsheets, credentials, and configuration files.",
                color: "text-primary-main",
                bg: "bg-primary-main/10"
              },
              { 
                icon: Eye, 
                title: "Forensic Evidence", 
                desc: "The system captures desktop screenshots, webcam photos, and IP-level telemetry the millisecond a trap is triggered.",
                color: "text-danger-main",
                bg: "bg-danger-main/10"
              },
              { 
                icon: Activity, 
                title: "AI Rule Engine", 
                desc: "Behavioral analysis automatically escalates alerts when suspicious repeat patterns or high-speed access is detected.",
                color: "text-success",
                bg: "bg-success/10"
              },
              { 
                icon: Zap, 
                title: "Real-time Pulse", 
                desc: "Direct-to-socket notifications ensure your security team is alerted within 200ms of any unauthorized file access.",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              },
              { 
                icon: Database, 
                title: "Audit Logging", 
                desc: "Immutable logs of every read, edit, delete, and open event, providing a clear timeline for incident response.",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              { 
                icon: Shield, 
                title: "Zero False Positives", 
                desc: "Because HoneyTokens are never used by legitimate systems, any interaction is a verified security event.",
                color: "text-cyan-400",
                bg: "bg-cyan-400/10"
              }
            ].map((item, i) => (
              <div key={i} className="glass-card p-10 group hover:border-white/20 transition-all duration-500 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 ${item.bg}`}></div>
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Showcase */}
      <section id="security" className="py-32 bg-dark-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
           <div className="grid lg:grid-cols-2 items-center gap-20">
              <div className="space-y-12">
                 <div className="inline-block px-4 py-1 rounded-full bg-danger-main/10 text-danger-main border border-danger-main/20 text-[10px] font-black tracking-widest uppercase">
                    Forensic Capabilities
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                    WE DON'T JUST ALERT, <br/>
                    WE CAPTURE.
                 </h2>
                 <p className="text-xl text-gray-400 leading-relaxed">
                    Most tools tell you something happened. Nxtzen shows you exactly who did it. Our forensic engine collects high-resolution evidence that holds up in any investigation.
                 </p>
                 <ul className="space-y-6">
                    {[
                      "Desktop Snapshot (Dual Screen Support)",
                      "Intruder Webcam Capture (Low Light support)",
                      "Hardware & OS Telemetry",
                      "Network Path Trace & IP Geolocation"
                    ].map((li, i) => (
                      <li key={i} className="flex items-center gap-4 text-white font-semibold">
                         <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center border border-success/40">
                            <CheckCircle className="w-4 h-4 text-success" />
                         </div>
                         {li}
                      </li>
                    ))}
                 </ul>
              </div>
              
              <div className="relative group">
                 <div className="absolute -inset-4 bg-gradient-to-r from-primary-main to-danger-main opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                 <div className="glass-card aspect-[4/3] rounded-3xl border-white/5 relative z-10 p-4 shadow-3xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1470" 
                      alt="Cybersecurity Dashboard" 
                      className="w-full h-full object-cover rounded-2xl opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-dark-900/80 backdrop-blur-xl rounded-2xl border border-white/10">
                       <div className="flex items-center gap-4 mb-3">
                          <div className="w-2 h-2 rounded-full bg-danger-main animate-ping"></div>
                          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Active Breach Detection</span>
                       </div>
                       <p className="text-white text-lg font-bold">Threat Identified in <span className="text-danger-main">Finance_Database.xlsx</span></p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-8">
           <div className="glass-card p-20 text-center rounded-[40px] border-primary-main/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary-main/5 group-hover:bg-primary-main/10 transition-colors"></div>
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">READY TO DECEIVE?</h2>
                 <p className="text-gray-400 mb-12 text-lg max-w-xl mx-auto">
                    Join elite security teams using Nxtzen to proactively neutralize insider threats and data leakage.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Link to="/login" className="btn-primary h-16 px-12 rounded-2xl text-xl font-black w-full sm:w-auto uppercase tracking-tighter">
                       Deploy Now
                    </Link>
                    <a href="mailto:sales@nxtzen.com" className="h-16 px-12 rounded-2xl text-xl font-bold text-white hover:bg-white/5 transition-all w-full sm:w-auto border border-white/10 flex items-center justify-center backdrop-blur-sm">
                       Book a Demo
                    </a>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 bg-dark-950 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
             <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-8 group cursor-pointer">
                   <Shield className="w-8 h-8 text-primary-main group-hover:rotate-12 transition-transform" />
                   <span className="text-2xl font-black text-white italic uppercase">Nxtzen</span>
                </div>
                <p className="text-gray-500 max-w-xs leading-relaxed text-sm mb-8">
                   Advanced cognitive security systems for the next generation of digital infrastructure. Deception, Detection, Neutralization.
                </p>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center hover:bg-primary-main/10 hover:border-primary-main/30 transition-all cursor-pointer">
                      <Globe className="w-4 h-4 text-gray-400" />
                   </div>
                   <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center hover:bg-primary-main/10 hover:border-primary-main/30 transition-all cursor-pointer">
                      <Zap className="w-4 h-4 text-gray-400" />
                   </div>
                   <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center hover:bg-primary-main/10 hover:border-primary-main/30 transition-all cursor-pointer">
                      <Cpu className="w-4 h-4 text-gray-400" />
                   </div>
                </div>
             </div>
             
             <div>
                <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Platform</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Monitors</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Alert Engine</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Forensics</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">AI Rule Builder</li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Resources</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Documentation</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">API Reference</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Security Whitepaper</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Case Studies</li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Legal</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Privacy Policy</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Terms of Service</li>
                   <li className="hover:text-white transition-colors cursor-pointer text-xs">Cookie Policy</li>
                </ul>
             </div>
          </div>
          
          <div className="pt-12 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Nxtzen Cognitive Systems. All rights reserved.</p>
            <div className="flex gap-8">
               <span className="hover:text-primary-main transition-colors cursor-pointer">Security Status: Operations Green</span>
               <span className="hover:text-danger-main transition-colors cursor-pointer">Threat Level: Elevated</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
