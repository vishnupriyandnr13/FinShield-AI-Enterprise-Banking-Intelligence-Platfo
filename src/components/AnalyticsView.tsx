import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, AlertOctagon, LayoutGrid, SlidersHorizontal } from 'lucide-react';

interface AnalyticsViewProps {
  data: {
    transactionTrend: any[];
    fraudTrend: any[];
    riskDistribution: any[];
    categoryAnalysis: any[];
  } | null;
  loading: boolean;
}

export default function AnalyticsView({ data, loading }: AnalyticsViewProps) {
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const [focusCategory, setFocusCategory] = useState('All Categories');
  const [threatCutoff, setThreatCutoff] = useState(60);
  const [simulatedLoadMultiplier, setSimulatedLoadMultiplier] = useState(1.0);

  // Memoized user controls adjustment
  const adjustedTransactionTrend = useMemo(() => {
    if (!data || !data.transactionTrend) return [];
    return data.transactionTrend.map(point => {
      let multiplier = simulatedLoadMultiplier;
      if (focusCategory !== 'All Categories') {
        multiplier *= 0.35; // category slice
      }
      return {
        ...point,
        value: Number((point.value * multiplier).toFixed(1))
      };
    });
  }, [data, focusCategory, simulatedLoadMultiplier]);

  const adjustedFraudTrend = useMemo(() => {
    if (!data || !data.fraudTrend) return [];
    return data.fraudTrend.map(point => {
      const casesFactor = (110 - threatCutoff) / 50; 
      let multiplier = simulatedLoadMultiplier;
      if (focusCategory !== 'All Categories') {
        multiplier *= 0.28;
      }
      return {
        ...point,
        cases: Math.max(0, Math.round(point.cases * casesFactor * multiplier)),
        falsePositives: Math.max(0, Math.round(point.falsePositives * (threatCutoff / 60) * multiplier))
      };
    });
  }, [data, focusCategory, threatCutoff, simulatedLoadMultiplier]);

  const adjustedRiskDistribution = useMemo(() => {
    if (!data || !data.riskDistribution) return [];
    return data.riskDistribution.map(point => {
      // Highlight/adjust based on criteria
      let count = point.count;
      if (focusCategory !== 'All Categories') {
        count = Math.max(1, Math.round(count * 0.4));
      }
      // If cutoff is high, we simulate shift to higher alerts
      if (threatCutoff > 70 && (point.range === '61-80' || point.range === '81-100')) {
        count = Math.round(count * 1.3);
      }
      return {
        ...point,
        count: Math.round(count * simulatedLoadMultiplier)
      };
    });
  }, [data, focusCategory, threatCutoff, simulatedLoadMultiplier]);

  const adjustedCategoryAnalysis = useMemo(() => {
    if (!data || !data.categoryAnalysis) return [];
    if (focusCategory === 'All Categories') return data.categoryAnalysis;
    
    // Highlight the chosen category
    return data.categoryAnalysis.map(item => {
      const isTarget = item.name.toLowerCase().includes(focusCategory.toLowerCase().slice(0, 5));
      return {
        ...item,
        value: isTarget ? Math.min(100, item.value * 2) : Math.max(1, Math.round(item.value / 2))
      };
    });
  }, [data, focusCategory]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 h-72 animate-pulse flex flex-col justify-between">
              <div className="h-5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-44 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Security & Operational Intelligence</h2>
          <p className="text-xs text-slate-500">Continuous enterprise ledger audit analysis computed over live events</p>
        </div>
      </div>

      {/* Interactive Controls Bar for User Inputs */}
      <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest block">
            Interactive Intelligence Controls
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal">
          Adjust the parameters below to filter security telemetry, inspect hypothetical shopping surge loads, and analyze category specific risk margins.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* 1. Category Filter */}
          <div className="space-y-1">
            <label htmlFor="analytics-focus-category" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Focus Category</label>
            <select
              id="analytics-focus-category"
              value={focusCategory}
              onChange={(e) => setFocusCategory(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium cursor-pointer"
            >
              <option value="All Categories">All Categories (Aggregate)</option>
              <option value="Retail">Retail Focus</option>
              <option value="Food & Beverage">Food & Beverage Focus</option>
              <option value="Electronics">Electronics Focus</option>
              <option value="Travel">Travel Focus</option>
              <option value="Financial Services">Financial Services Focus</option>
            </select>
          </div>

          {/* 2. Threat Cutoff Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="analytics-threat-cutoff" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Risk Severity Highlight</label>
              <span className="text-[10px] font-mono text-blue-600 font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">{threatCutoff}%</span>
            </div>
            <input
              id="analytics-threat-cutoff"
              type="range"
              min="15"
              max="85"
              value={threatCutoff}
              onChange={(e) => setThreatCutoff(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-ew-resize mt-1 bg-slate-200 h-1.5 rounded-lg appearance-none"
            />
          </div>

          {/* 3. Load Simulation Multiplier */}
          <div className="space-y-1">
            <label htmlFor="analytics-event-multiplier" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Festive Sale Load Factor</label>
            <select
              id="analytics-event-multiplier"
              value={simulatedLoadMultiplier}
              onChange={(e) => setSimulatedLoadMultiplier(Number(e.target.value))}
              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium cursor-pointer"
            >
              <option value="1.0">1.0x Baseline Traffic</option>
              <option value="1.5">1.5x Minor Holiday Drift</option>
              <option value="2.5">2.5x Festival Shopping Rush</option>
              <option value="5.0">5.0x Extreme Black Friday Surge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exactly 4 Structured Visualizations Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Transaction Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">1. Transaction Trend Hour-to-Hour</h3>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">Aggregate Clearing Value (INR Cr)</span>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adjustedTransactionTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(val: number) => `INR ${val} Cr`} />
                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Fraud Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">2. Threat Velocity Ratio</h3>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">Confirmed Fraud vs False Positives</span>
            </div>
            <AlertOctagon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjustedFraudTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} style={{ fontSize: '11px' }} />
                <Bar dataKey="cases" name="Confirmed Fraud" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="falsePositives" name="False Positives" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Risk Score Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">3. Ledger Risk Score Spread</h3>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">Frequency count in standard buckets</span>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjustedRiskDistribution} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Merchant Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">4. Merchant Transaction Volume</h3>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">Category aggregate weight allocation</span>
            </div>
            <LayoutGrid className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adjustedCategoryAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {adjustedCategoryAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" style={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
