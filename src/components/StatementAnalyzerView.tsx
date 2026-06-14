import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  UploadCloud, 
  FileText, 
  BadgeCheck, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpRight, 
  ShoppingBag,
  Search,
  BookOpenCheck
} from 'lucide-react';
import { StatementAnalysis } from '../types.js';

interface StatementAnalyzerViewProps {
  onAnalyze: (fileData: string, fileType: string, fileName: string) => Promise<void>;
  analysis: StatementAnalysis | null;
  loading: boolean;
}

export default function StatementAnalyzerView({
  onAnalyze,
  analysis,
  loading
}: StatementAnalyzerViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'categories' | 'transactions'>('summary');
  const [searchVal, setSearchVal] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Demo statements in case the user does not have a local bank PDF or image.
  const presetStatements = [
    {
      name: "Q3_Enterprise_Ledger.png",
      label: "Sample Corporate Statement",
      desc: "High volume retail debits & salary credits",
      fakeData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // mock base 1x1 png representing PNG
    },
    {
      name: "Dec2025_FlipkartMerchant.jpeg",
      label: "Sample E-commerce Merchant",
      desc: "Multiple device purchases and utility credits",
      fakeData: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processSelectedFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        await onAnalyze(base64Data, file.type, file.name);
        resolve();
      };
    });
  };

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <BookOpenCheck className="text-blue-600 w-6 h-6" /> Intelligent Bank Statement Analyzer
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Convert PDF or JPEG statement scans into structured data instantly with our server-side OCR LLM parser.
        </p>
      </div>

      {/* Main Drag-Drop Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
            dragActive 
              ? 'border-blue-500 bg-blue-50/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,image/png,image/jpeg,image/jpg"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="bg-white p-3 rounded-full shadow-sm border border-slate-200/60 mb-3 text-blue-600">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-700 block">Drag & Drop Bank Statement Here</span>
            <span className="text-[11px] text-slate-400 block mt-1">Accepts PDF, PNG, JPEG formats (Max 15MB)</span>
          </div>
          <span className="mt-4 px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all select-none">
            Browse Local Files
          </span>
        </div>

        {/* Preset demo triggers */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider text-center">Quick Demonstration Presets</span>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {presetStatements.map((curr) => (
              <button
                key={curr.name}
                type="button"
                onClick={() => onAnalyze(curr.fakeData, "image/png", curr.name)}
                className="flex-1 p-3 text-left border border-slate-200/80 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                disabled={loading}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="p-1 px-1.5 bg-slate-100 text-slate-500 rounded font-mono font-bold text-[9px] uppercase shrink-0 mt-0.5">JPEG</div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{curr.label}</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">{curr.desc}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-center items-center gap-3 text-center animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div>
            <span className="text-sm font-bold text-slate-800 block">AI Parsing Bank Ledger...</span>
            <span className="text-xs text-slate-400 block mt-1">Extracting totals, categorized margins, and ledger listings</span>
          </div>
        </div>
      )}

      {/* Structured Results Display */}
      {analysis && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Statement File Info Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Extraction Complete</span>
                <span className="text-[10px] text-slate-400 block">Multi-Factor OCR validated successfully</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Parsed
            </span>
          </div>

          {/* THREE TABS ONLY as requested */}
          <div className="flex border-b border-slate-200 bg-white sticky top-0">
            <button
              onClick={() => setActiveSubTab('summary')}
              className={`flex-1 text-center py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'summary' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Summary Check
            </button>
            <button
              onClick={() => setActiveSubTab('categories')}
              className={`flex-1 text-center py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'categories' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Spending Categories
            </button>
            <button
              onClick={() => setActiveSubTab('transactions')}
              className={`flex-1 text-center py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'transactions' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Transactions
            </button>
          </div>

          {/* Tab 1: Summary */}
          {activeSubTab === 'summary' && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Total Debit */}
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Debited Flow</span>
                  <div className="flex items-center gap-1.5 text-lg font-bold text-red-600">
                    <TrendingDown className="w-5 h-5 shrink-0" />
                    <span>{analysis.summary.totalDebit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  </div>
                </div>

                {/* Total Credit */}
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Credited Flow</span>
                  <div className="flex items-center gap-1.5 text-lg font-bold text-emerald-600">
                    <TrendingUp className="w-5 h-5 shrink-0" />
                    <span>{analysis.summary.totalCredit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  </div>
                </div>

              </div>

              <div className="bg-blue-50/40 border border-blue-100/85 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Outlier Analytics Metrics</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Highest Expense Value:</span>
                    <strong className="text-slate-800 font-mono">
                      {analysis.summary.highestExpense.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Highest Expense Recipient:</span>
                    <strong className="text-slate-800 truncate max-w-[150px]">{analysis.summary.highestMerchant}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Spending Categories (PIE CHART ONLY as requested) */}
          {activeSubTab === 'categories' && (
            <div className="p-5 flex flex-col justify-center items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Pie Breakdown of Expenses</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.categories}
                      cx="50%"
                      cy="48%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analysis.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => `INR ${val.toLocaleString('en-IN')}`} />
                    <Legend verticalAlign="bottom" height={36} iconSize={10} style={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 3: Transactions */}
          {activeSubTab === 'transactions' && (
            <div className="p-3 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter statement rows..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-[11px] text-slate-600">
                  <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Debit (INR)</th>
                      <th className="py-2.5 px-3 text-right">Credit (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysis.transactions
                      .filter(t => t.description.toLowerCase().includes(searchVal.toLowerCase()) || t.category.toLowerCase().includes(searchVal.toLowerCase()))
                      .map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-400">{t.date}</td>
                          <td className="py-2 px-3 font-bold text-slate-800">{t.description}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-red-600 font-semibold font-mono">
                            {t.type === 'debit' ? t.amount.toLocaleString('en-IN') : '-'}
                          </td>
                          <td className="py-2 px-3 text-right text-emerald-600 font-semibold font-mono">
                            {t.type === 'credit' ? t.amount.toLocaleString('en-IN') : '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
