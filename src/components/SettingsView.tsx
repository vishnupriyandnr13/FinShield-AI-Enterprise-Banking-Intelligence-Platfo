import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Cpu, 
  BellRing, 
  Globe, 
  HelpCircle, 
  CheckCircle,
  Database,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

interface SettingsViewProps {
  apiKeyActive: boolean;
}

export default function SettingsView({ apiKeyActive }: SettingsViewProps) {
  const [model, setModel] = useState('gemini-3.5-flash');
  const [theme, setTheme] = useState('Slate Classic (High Contrast)');
  const [channels, setChannels] = useState({
    smsAlerts: true,
    webhookTrigger: false,
    fiuIndirect: true,
    vCiPAudits: true
  });

  const handleToggle = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" /> Platform Security & Configuration
        </h2>
        <p className="text-xs text-slate-500">Fine-tune AI detection thresholds, notifications, system themes, and models</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
        
        {/* API & Model selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Model & Integrations</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Model Selection Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="model-select" className="text-[11px] font-bold text-slate-500">Core Gemini Model</label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (Standard - Highly Scalable)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Expert reasoning)</option>
              </select>
            </div>

            {/* API Key Status Indicator */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">Server-side Secrets Status</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-600">GEMINI_API_KEY</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                  apiKeyActive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" /> {apiKeyActive ? "REGISTERED" : "OFFLINE FALLBACK"}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">System Aesthetics</h3>
          
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block">Active Interface Theme</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('Slate Classic (High Contrast)')}
                className={`p-3 text-left border rounded-xl flex items-center justify-between text-xs font-bold ${
                  theme === 'Slate Classic (High Contrast)'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Slate Classic (High Contrast Light)</span>
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('Enterprise Twilight')}
                className={`p-3 text-left border rounded-xl flex items-center justify-between text-xs font-bold ${
                  theme === 'Enterprise Twilight'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Enterprise Navy Twilight (Dark)</span>
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Checkbox Preferences */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Notification preferences</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <button
              onClick={() => handleToggle('smsAlerts')}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-700 block">Direct SMS Audit Dispatch</span>
                <span className="text-[10px] text-slate-400">Trigger immediate SMS warning to cardholders</span>
              </div>
              <input 
                type="checkbox" 
                checked={channels.smsAlerts} 
                onChange={() => {}} 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/10 pointer-events-none" 
              />
            </button>

            <button
              onClick={() => handleToggle('webhookTrigger')}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-700 block">External Webhook Gateway</span>
                <span className="text-[10px] text-slate-400">POST fraudulent payloads directly to external services</span>
              </div>
              <input 
                type="checkbox" 
                checked={channels.webhookTrigger} 
                onChange={() => {}} 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/10 pointer-events-none" 
              />
            </button>

            <button
              onClick={() => handleToggle('fiuIndirect')}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-700 block">FIU-IND Reporting Channel</span>
                <span className="text-[10px] text-slate-400">Prepare automatic Suspicious Transaction reports</span>
              </div>
              <input 
                type="checkbox" 
                checked={channels.fiuIndirect} 
                onChange={() => {}} 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/10 pointer-events-none" 
              />
            </button>

            <button
              onClick={() => handleToggle('vCiPAudits')}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left cursor-pointer"
            >
              <div>
                <span className="font-bold text-slate-700 block">V-CIP Verification Checks</span>
                <span className="text-[10px] text-slate-400">Double scan KYC identification records with AI OCR</span>
              </div>
              <input 
                type="checkbox" 
                checked={channels.vCiPAudits} 
                onChange={() => {}} 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/10 pointer-events-none" 
              />
            </button>

          </div>
        </div>

        {/* About section */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-3.5 text-xs text-slate-500">
          <Fingerprint className="w-8 h-8 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-700">Abiding RBI Directives: AML, KYC, and Cyber Risk Safe</h4>
            <p className="leading-relaxed">
              {"FinShield AI is built in full agreement with the Reserve Bank of India’s updated 2024 Cybersecurity Mandates, featuring instantaneous sandboxed multi-factor payment isolation and autonomous Suspicious Transaction reporting checks."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
