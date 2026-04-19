"use client"

import Link from "next/link"
import { Repeat, Zap, Shield, Globe, Users, ArrowRight, Brain, CalendarCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040914] text-white selection:bg-primary/30 selection:text-white overflow-hidden relative">
      
      {/* Massive Cosmic Background Glows */}
      <div className="fixed top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-primary/30 blur-[200px] rounded-full pointer-events-none mix-blend-screen opacity-70 animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="fixed bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-secondary/30 blur-[200px] rounded-full pointer-events-none mix-blend-screen opacity-70 animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="fixed top-[30%] left-[60%] w-[60vw] h-[60vw] bg-accent/20 blur-[200px] rounded-full pointer-events-none mix-blend-screen opacity-50 animate-[pulse_12s_ease-in-out_infinite]"></div>
      
      {/* Gradient Core Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0A1128]/50 via-transparent to-[#060D1E]/80 pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-[0_0_15px_rgba(0,229,255,0.5)]">
            <Repeat className="h-5 w-5 text-[#040914]" />
          </div>
          <span className="text-xl font-extrabold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">SkillSwap</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log In</Link>
          <Link href="/signup" className="px-5 py-2 text-sm font-bold bg-white text-[#040914] rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center max-w-5xl mx-auto space-y-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          The Future of Knowledge Exchange
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Trade your skills in the <br />
          <span className="text-transparent bg-clip-text gradient-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Digital Brain Trust.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light">
          No money required. Teach what you know, learn what you don't. SkillSwap is a real-time, peer-to-peer network for exchanging knowledge securely.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 gradient-primary text-[#040914] font-extrabold rounded-full text-lg shadow-soft shadow-primary/20 hover:shadow-primary/50 transition-all hover:-translate-y-1">
            Join the Network
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#features" className="px-8 py-4 font-semibold text-white rounded-full text-lg border border-border bg-[#0A1128] hover:bg-border transition-all">
            How it works
          </Link>
        </div>
      </main>

      {/* What the app does (Structured Grid) */}
      <section id="features" className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-[#0A1128]/80 to-transparent border-y border-border/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How <span className="text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">SkillSwap</span> Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A highly structured, hyper-fluid ecosystem designed to seamlessly connect minds globally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="card-premium p-8 group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. List Your Skills</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Add what you are good at and what you want to learn. Our system calculates matches instantly.
              </p>
            </div>

            <div className="card-premium p-8 group">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(176,38,255,0.2)]">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Explore the Grid</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Scan the global marketplace for individuals who hold the knowledge you seek and need the skills you have.
              </p>
            </div>

            <div className="card-premium p-8 group">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,42,133,0.2)]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Send Requests</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Initiate a real-time connection. Our instant websocket architecture ensures they get notified instantly.
              </p>
            </div>

            <div className="card-premium p-8 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4. Schedule & Swap</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Accept incoming requests, pick a time slot in your dedicated dashboard, and complete the digital exchange.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mini Feature Stats */}
      <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto text-center border-b border-border/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Built for the Modern Learner</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text gradient-primary mb-2">100%</div>
            <p className="text-muted-foreground font-medium">Free & Peer-to-Peer</p>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text gradient-primary mb-2">0ms</div>
            <p className="text-muted-foreground font-medium">Real-time Synchronization</p>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text gradient-primary mb-2">Infinite</div>
            <p className="text-muted-foreground font-medium">Learning Potential</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 text-center text-muted-foreground text-sm bg-[#040914]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Repeat className="h-4 w-4 text-primary" />
            <span className="font-bold text-white uppercase tracking-widest">SkillSwap</span>
          </div>
          <p>© {new Date().getFullYear()} SkillSwap Network. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}