import React from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle, 
  AlertTriangle, 
  Heart, 
  Activity, 
  ChevronRight, 
  Clock, 
  BadgeAlert, 
  Cpu, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';
import { Transaction } from '../types.js';

interface DashboardViewProps {
  kpis: {
    transactionsProcessed: number;
    fraudAlerts: number;
    averageRiskScore: number;
    systemHealth: string;
  };
  transactions: Transaction[];
  loading: boolean;
  onViewAllTransactions: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export default function DashboardView({
  kpis,
  transactions,
  loading,
  onViewAllTransactions,
  onSelectTransaction
}: DashboardViewProps) {

  // Simple clean mock line chart data for volume distribution
  const chartData = [
    { name: '10:00 AM', volume: 145 },
    { name: '10:10 AM', volume: 220 },
    { name: '10:20 AM', volume: 185 },
    { name: '10:30 AM', volume: 390 },
    { name: '10:40 AM', volume: 320 },
    { name: '10:50 AM', volume: 540 },
    { name: '11:00 AM', volume: 490 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        {/* Chart Skeleton */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-80 animate-pulse flex flex-col justify-between">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-44 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Card 1: Transactions Processed */}
        <motion.div 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Transactions Processed</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">
              {kpis.transactionsProcessed.toLocaleString()}
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </motion.div>

        {/* Card 2: Fraud Alerts */}
        <motion.div 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Fraud Alerts</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">
              {kpis.fraudAlerts}
            </span>
          </div>
          <div className={`p-2.5 rounded-lg ${kpis.fraudAlerts > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3: Average Risk Score */}
        <motion.div 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Average Risk Score</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">
              {kpis.averageRiskScore}%
            </span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <Cpu className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 4: System Health */}
        <motion.div 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">System Health</span>
            <span className="text-2xl font-bold text-emerald-600 block mt-1">
              {kpis.systemHealth}
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
        </motion.div>

      </div>

      {/* Main Single Chart Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Real-Time Transaction Volume</h2>
            <p className="text-xs text-slate-500">Live system throughput computed in 10-minute bins</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-md">
            +14% Peak Change
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px', border: 'none' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#2563EB" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 1, fill: '#FFF' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Compact Transaction Table - Max 10 Rows */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Incoming Core Ledger</h2>
            <p className="text-xs text-slate-500">Maximum 10 real-time transaction updates displayed iteratively</p>
          </div>
          <button
            onClick={onViewAllTransactions}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Go to Audits <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs font-medium">
                    No transaction entries recorded yet. Turn on the Peak Traffic Simulator to see streams.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 10).map((tx) => {
                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => onSelectTransaction(tx)}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {tx.time}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{tx.merchant}</td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                tx.riskScore > 75 ? 'bg-red-500' : tx.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${tx.riskScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700">{tx.riskScore}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          tx.status === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : tx.status === 'Flagged'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTransaction(tx);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline opacity-80 group-hover:opacity-100 cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5 text-blue-500" /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* View More Button */}
        <div className="p-4 border-t border-slate-100 text-center">
          <button
            onClick={onViewAllTransactions}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-all"
          >
            <span>View More Transactions</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
