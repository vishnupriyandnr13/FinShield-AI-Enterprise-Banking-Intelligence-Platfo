import React from 'react';
import { 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface UserGuideViewProps {
  onNavigate: (tab: string) => void;
}

export default function UserGuideView({ onNavigate }: UserGuideViewProps) {
  const steps = [
    {
      title: "1. Evaluate Custom Transactions (Check Fraud Or Not)",
      desc: "Manually submit any payment particulars (Amount, Merchant Name, Category) into the Real-time Predictor. The server-side Gemini Reasoning agent assesses risk score percentages, explains potential triggers, and links suspicious activity to actual Reserve Bank of India (RBI) compliance guidelines.",
      icon: ShieldCheck,
      actionLabel: "Submit Custom Transaction",
      tabTarget: "fraud",
      colorClass: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "2. Trigger High-Volume Stress Tests",
      desc: "Configure transaction-per-second (TPS) parameters (up to 100,000 TPS) and threat velocity percentage curves inside the Peak Traffic Simulator wizard. Track live operational metrics like clearing success ratios and millisecond response latencies under heavy simulated shopping scenarios like Black Friday or Big Billion Days.",
      icon: Zap,
      actionLabel: "Launch Simulation Wizard",
      tabTarget: "simulator",
      colorClass: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      title: "3. Instantly Parse & Audit Bank Statements",
      desc: "Upload local bank PDF statements or JPEG ledger scans into the Statement Analyzer. Watch our server-side vision engine extract transaction lists, calculate debit-credit velocity distributions, and display categorized visual percentage pie summaries immediately.",
      icon: FileText,
      actionLabel: "Upload Statement File",
      tabTarget: "statement",
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "4. Consult Sovereign Compliance Copilot",
      desc: "Interrogate the FinShield Copilot about RBI KYC requirements, suspicious filing standards (STRs), or Anti-Money Laundering (AML) standards. The system handles conversational queries with zero-latency sandbox retrieval.",
      icon: MessageSquare,
      actionLabel: "Open Expert Compliance Desk",
      tabTarget: "compliance",
      colorClass: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "5. Review Strategic Operational Intelligence",
      desc: "Monitor threat velocity, transaction trends time charts, risk distribution standard buckets, and merchant aggregate weight categories updated seamlessly over live incoming ledger blocks.",
      icon: BarChart3,
      actionLabel: "Inspect Diagnostic Charts",
      tabTarget: "analytics",
      colorClass: "text-pink-600 bg-pink-50 border-pink-100"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Visual Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-blue-600 text-white p-4 rounded-xl shrink-0">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Onboarding Desk</span>
          <h1 className="text-xl font-bold tracking-tight text-white block">Welcome to the FinShield AI Handguide</h1>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            FinShield AI is a state-of-the-art transaction monitoring, risk isolation, and RBI compliance RAG platform designed for commercial ledger auditing. Use this handbook to test all interactive capabilities.
          </p>
        </div>
      </div>

      {/* Guide Steps Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Interactive Modules & Walkthrough Guide</h2>
        
        <div className="space-y-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
              >
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-lg border shrink-0 ${item.colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(item.tabTarget)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-[11px] font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1 group self-end md:self-auto"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Testing Matrix Prompt Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Quick Walkthrough Sandbox Tour</h3>
        </div>
        <p className="text-xs text-blue-600/90 leading-relaxed">
          <strong>Recommended Flow:</strong> Go to the <button onClick={() => onNavigate('fraud')} className="underline font-bold text-blue-700 hover:text-blue-900 cursor-pointer">Fraud Analysis</button> tab, submit an amount over <code className="font-mono bg-blue-100/60 px-1 py-0.5 rounded text-blue-800 font-bold">INR 1,20,000</code> with a suspicious merchant name like <code className="font-mono bg-blue-100/60 px-1 py-0.5 rounded text-blue-800 font-bold">"CryptoX Liquidations"</code>. Our AI safety guard instantly flags it, displays a reasoning drawer card on the right, and references retrieved RBI policies for secure processing.
        </p>
      </div>

    </div>
  );
}
