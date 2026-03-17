import React from 'react';
import { ShieldAlert, Zap, Eye, BarChart3, Lock, Target } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "AI Honeytoken Traps",
      description: "Automatically deploy deceptive files that appear indistinguishable from authentic assets to lure unauthorized users.",
      accent: "from-primary/20",
      iconColor: "text-primary"
    },
    {
      icon: Zap,
      title: "Real-time Threat Detection",
      description: "Instant alerts triggered via WebSockets the millisecond a suspicious file interaction is detected inside your perimeter.",
      accent: "from-accent/20",
      iconColor: "text-accent"
    },
    {
      icon: Eye,
      title: "Forensic Evidence Capture",
      description: "Automatically capture high-resolution desktop screenshots and webcam photos of intruders for bulletproof attribution.",
      accent: "from-danger/20",
      iconColor: "text-danger"
    },
    {
      icon: BarChart3,
      title: "Attack Intelligence",
      description: "Analyze access patterns, IP telemetry, and suspicious behavior through our specialized SOC intelligence dashboard.",
      accent: "from-warning/20",
      iconColor: "text-warning"
    }
  ];

  return (
    <section id="features" className="py-32 bg-[#08080a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="h-0.5 w-12 bg-primary mb-8 rounded-full"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase italic">
            Engineered for <span className="text-primary">Total Deception.</span>
          </h2>
          <p className="text-gray-500 max-w-xl text-sm font-medium tracking-wide">
            Our infrastructure creates an invisible minefield of high-interaction traps, 
            providing forensic certainty where traditional endpoint security fails.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-10 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 relative z-10`}>
                <f.icon className={`w-8 h-8 ${f.iconColor} filter drop-shadow-[0_0_8px_currentColor]`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight relative z-10">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium relative z-10">
                {f.description}
              </p>
              
              <div className="mt-8 flex items-center text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                Protocol Active <Lock className="w-3 h-3 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
