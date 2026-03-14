import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Bell, Activity, ChevronRight, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans selection:bg-primary-main/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary-main" />
          <span className="text-xl font-bold text-white tracking-tight">Nxtzen</span>
        </div>
        <div>
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-6">
            Sign In
          </Link>
          <Link to="/login" className="btn-primary py-2 px-5 rounded-full text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-main/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-danger-main/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800 border border-dark-700 text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-danger-main animate-pulse-fast"></span>
            Detect Insider Threats Instantly
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-cyan-400">HoneyToken</span> <br/>
            Security for SaaS
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            Deploy undetectable trap files across your digital infrastructure. Get instant alerts, forensic snapshots, and activity heatmaps the moment an unauthorized user access them.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="btn-primary px-8 py-4 rounded-full text-lg w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Start Monitoring Now
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 rounded-full text-lg text-white font-medium hover:bg-dark-800 transition-colors w-full sm:w-auto border border-transparent hover:border-dark-700">
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="border-y border-dark-800 bg-dark-900/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 uppercase tracking-widest text-sm font-semibold">
          Trusted by Next-Gen Security Teams
          <div className="mt-8 flex flex-wrap justify-center gap-12 sm:gap-24 opacity-50 grayscale">
             {/* Dummy logos */}
             <div className="text-2xl font-bold flex items-center gap-2"><Lock className="w-6 h-6"/> SECURECORP</div>
             <div className="text-2xl font-bold flex items-center gap-2"><Activity className="w-6 h-6"/> DATAGUARD</div>
             <div className="text-2xl font-bold flex items-center gap-2"><Zap className="w-6 h-6"/> CYBERNXT</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to stop data breaches</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Set up powerful deception technology in minutes, not months.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary-main/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-main/20 transition-colors">
                <Lock className="w-6 h-6 text-primary-main" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Honeypot Traps</h3>
              <p className="text-gray-400 leading-relaxed">
                Create fake files that look like valuable corporate data. The moment an intruder touches them, the system triggers a lockdown alert.
              </p>
            </div>

            <div className="glass-card p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-danger-main/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-danger-main/20 transition-colors bg-gradient-to-br from-dark-800">
                <Bell className="w-6 h-6 text-danger-main" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Alerting</h3>
              <p className="text-gray-400 leading-relaxed">
                Receive instant WebSockets toast notifications and comprehensive email reports complete with forensic dashboard snapshots.
              </p>
            </div>

            <div className="glass-card p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6 border border-success/20">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Activity Heatmaps</h3>
              <p className="text-gray-400 leading-relaxed">
                Track file open durations, multiple access attempts, and build a heatmap of suspicious activity times across your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-12 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary-main opacity-50" />
          <span className="text-lg font-bold text-gray-400">Nxtzen</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Nxtzen Cognitive Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
