import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Live for Universities
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Streamline Your <br /> Campus Placements.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            A centralized coordination platform designed to modernize recruitment workflows. 
            Automated eligibility, real-time tracking, and seamless communication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="group h-12 px-8 flex items-center gap-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          {[
            { 
              icon: Zap, 
              title: "Automated Eligibility", 
              desc: "Instant filtering based on CGPA, department, and skills. No more manual spreadsheets." 
            },
            { 
              icon: Shield, 
              title: "Secure & Reliable", 
              desc: "Built with production-grade backend architecture and encrypted data handling." 
            },
            { 
              icon: BarChart3, 
              title: "Live Tracking", 
              desc: "Monitor your application status from 'Applied' to 'Selected' in real-time." 
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
    </div>
  );
}
