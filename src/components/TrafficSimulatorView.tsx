import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  HelpCircle, 
  Play, 
  CircleDot, 
  StopCircle, 
  Activity, 
  ShieldAlert, 
  Gauge, 
  Clock, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { SimulationConfig, SimulationStats } from '../types.js';

interface TrafficSimulatorViewProps {
  config: SimulationConfig;
  stats: SimulationStats;
  onStartSimulation: (cfg: SimulationConfig) => void;
  onStopSimulation: () => void;
}

export default function TrafficSimulatorView({
  config,
  stats,
  onStartSimulation,
  onStopSimulation
}: TrafficSimulatorViewProps) {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(config.scenario);
  const [tps, setTps] = useState(config.tps);
  const [fraudRate, setFraudRate] = useState(config.fraudRate);

  const scenarioOptions = [
    { value: 'Normal Banking Day', label: 'Normal Banking Day', desc: 'Standard operating workloads with stable fraud ratios' },
    { value: 'Black Friday 2025', label: 'Black Friday 2025', desc: 'High velocity commercial shopping spikes' },
    { value: 'Big Billion Days', label: 'Big Billion Days', desc: 'Sudden high concurrent volumes from India commerce hubs' },
    { value: 'Festival Season', label: 'Festival Season', desc: 'Sustained elevated buying behavior spanning multiple days' },
    { value: 'Flash Sale', label: 'Flash Sale', desc: 'Extreme instantaneous volume curves testing server buffers' },
    { value: 'Custom', label: 'Custom Parameters', desc: 'Manually override thresholds' },
  ];

  // Sync internal state with props if simulation changes externally
  useEffect(() => {
    if (config.active) {
      setScenario(config.scenario);
      setTps(config.tps);
      setFraudRate(config.fraudRate);
    }
  }, [config]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLaunch = () => {
    onStartSimulation({
      scenario,
      tps,
      fraudRate,
      active: true
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <Zap className="text-blue-600 w-6 h-6" /> Peak Traffic Scenario Simulator
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Test core ledger buffers and trigger AI fraud detection mechanisms under extreme simulated shopping load profiles.
        </p>
      </div>

      {/* Simulator Active Monitor Mode */}
      {config.active ? (
        <motion.div 
          className="bg-white border border-blue-200 shadow-md rounded-2xl p-6 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Active Experiment</span>
                <span className="text-sm font-bold text-slate-800">{config.scenario}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-full">
              Live Flow Testing
            </span>
          </div>

          {/* Simple Clean Indicators (Show ONLY metrics requested) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Metric 1: Current TPS */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Current TPS</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {stats.currentTps.toLocaleString()} TPS
                </span>
              </div>
            </div>

            {/* Metric 2: Fraud Count */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Fraud Count</span>
                <span className="text-lg font-bold text-red-600 font-mono">
                  {stats.fraudCount} Matches
                </span>
              </div>
            </div>

            {/* Metric 3: Success Rate */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Success Rate</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">
                  {stats.successRate}%
                </span>
              </div>
            </div>

            {/* Metric 4: Processing Latency */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Processing Latency</span>
                <span className="text-lg font-bold text-slate-700 font-mono">
                  {stats.processingLatency} ms
                </span>
              </div>
            </div>

          </div>

          {/* Large Stop Simulation Button */}
          <div className="pt-2 text-center">
            <button
              onClick={onStopSimulation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 cursor-pointer shadow-md transition-all active:scale-[0.99]"
            >
              <StopCircle className="w-5 h-5" /> Stop Simulation
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Halting simulation restores traffic rate to baseline secure parameters.
            </p>
          </div>

        </motion.div>
      ) : (
        /* Wizard Step Configuration */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`w-6 h-2 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-blue-600 w-10' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">Step {step} of 4</span>
          </div>

          <div className="min-h-72 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Step 1: Choose Scenario</h2>
                    <p className="text-xs text-slate-400">Select standard behavior pattern parameters</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {scenarioOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setScenario(opt.value)}
                        className={`p-3 text-left border rounded-xl transition-all duration-150 cursor-pointer ${
                          scenario === opt.value
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CircleDot className={`w-4 h-4 shrink-0 ${scenario === opt.value ? 'text-blue-600' : 'text-slate-300'}`} />
                          <span className="text-sm font-bold text-slate-800">{opt.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-tight">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Step 2: Transaction Rate (TPS)</h2>
                    <p className="text-xs text-slate-400">Configure simulated aggregate volume load</p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Calculated Level</span>
                      <span className="text-xl font-extrabold text-blue-600 font-mono">
                        {tps.toLocaleString()} TPS
                      </span>
                    </div>

                    <input
                      type="range"
                      min="100"
                      max="100000"
                      step="100"
                      value={tps}
                      onChange={(e) => setTps(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono uppercase font-semibold">
                      <span>100 TPS (Low Load)</span>
                      <span>50,000 TPS</span>
                      <span>100,000 TPS (Max Peak Spike)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Step 3: Fraud Percentage Ratio</h2>
                    <p className="text-xs text-slate-400">Establish standard velocity fraud threat patterns</p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-200">
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Attack Threshold</span>
                      <span className="text-xl font-extrabold text-red-600 font-mono">
                        {fraudRate}% Fraud
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={fraudRate}
                      onChange={(e) => setFraudRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono uppercase font-semibold">
                      <span>0.0% (Near Clean Operations)</span>
                      <span>10.0%</span>
                      <span>20.0% (Severe System Compromise)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-800">Step 4: Review Parameters</h2>
                    <p className="text-xs text-slate-400">Review configuration metrics before deployment</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left max-w-sm mx-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Scenario profile:</span>
                      <strong className="text-slate-700">{scenario}</strong>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Transaction rate limit:</span>
                      <strong className="text-slate-700 font-mono">{tps.toLocaleString()} TPS</strong>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Target threat ratio:</span>
                      <strong className="text-red-600 font-mono">{fraudRate}%</strong>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleLaunch}
                      className="w-full max-w-xs inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/10 transition-all cursor-pointer text-base active:scale-[0.98]"
                    >
                      <Play className="w-5 h-5 fill-current" /> Start Simulation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between border-t border-slate-100 pt-5 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  step === 1 
                    ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              {step < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Helpful Hint */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-blue-700">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Configuring extreme traffic spikes like <strong>Black Friday 2025</strong> automatically simulates transaction streams. You can monitor flagged patterns immediately from the <strong>Fraud Analysis</strong> tab.
        </p>
      </div>

    </div>
  );
}
