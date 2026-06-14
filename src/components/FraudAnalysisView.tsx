import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  BookOpen, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  RotateCcw,
  FileSpreadsheet,
  Upload,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';
import { Transaction } from '../types.js';

interface FraudAnalysisViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  selectedTransaction: Transaction | null;
  onCloseDrawer: () => void;
  onCustomPredict: (amount: number, merchant: string, category: string) => Promise<void>;
  onBulkPredict: (parsedTxs: { amount: number; merchant: string; category?: string }[]) => Promise<void>;
  loadingPredict: boolean;
}

export default function FraudAnalysisView({
  transactions,
  onSelectTransaction,
  selectedTransaction,
  onCloseDrawer,
  onCustomPredict,
  onBulkPredict,
  loadingPredict
}: FraudAnalysisViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPredictForm, setShowPredictForm] = useState(false);
  const [showCsvImporter, setShowCsvImporter] = useState(true);
  const [newAmount, setNewAmount] = useState('');
  const [newMerchant, setNewMerchant] = useState('');
  const [newCategory, setNewCategory] = useState('Retail');

  // Drag & drop files states
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<{ amount: number; merchant: string; category?: string }[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state categories
  const categories = ['Retail', 'Food & Beverage', 'Electronics', 'Travel', 'Entertainment', 'Utilities', 'Financial Services', 'Other'];

  // Robust CSV Parser
  const parseCSVText = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];

    // Parse first line as header
    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    // Find column indices
    let amountIdx = header.findIndex(h => h.includes('amount') || h.includes('value') || h.includes('sum') || h.includes('inr'));
    let merchantIdx = header.findIndex(h => h.includes('merchant') || h.includes('recipient') || h.includes('payee') || h.includes('name') || h.includes('description'));
    let categoryIdx = header.findIndex(h => h.includes('cat') || h.includes('type'));

    const parsedRowsData: { amount: number; merchant: string; category?: string }[] = [];
    const startIndex = (amountIdx !== -1 || merchantIdx !== -1) ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const rawLine = lines[i].trim();
      if (!rawLine) continue;

      // Parse columns correctly respecting strings in quotes
      const cols: string[] = [];
      let insideQuote = false;
      let currentField = '';
      
      for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
        const char = rawLine[charIdx];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          cols.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      cols.push(currentField.trim());

      const cleanCols = cols.map(c => c.replace(/^["']|["']$/g, '').trim());
      if (cleanCols.length === 0 || (cleanCols.length === 1 && cleanCols[0] === '')) continue;

      let parsedAmount = 0;
      let parsedMerchant = '';
      let parsedCategory = 'Other';

      if (amountIdx !== -1 && cleanCols[amountIdx]) {
        parsedAmount = parseFloat(cleanCols[amountIdx].replace(/[^\d.-]/g, ''));
      }
      if (merchantIdx !== -1 && cleanCols[merchantIdx]) {
        parsedMerchant = cleanCols[merchantIdx];
      }
      if (categoryIdx !== -1 && cleanCols[categoryIdx]) {
        parsedCategory = cleanCols[categoryIdx];
      }

      // Safe index-fallback guess
      if (amountIdx === -1 || merchantIdx === -1) {
        const numColIdx = cleanCols.findIndex(c => !isNaN(parseFloat(c.replace(/[^\d.-]/g, ''))) && isFinite(Number(c.replace(/[^\d.-]/g, ''))));
        if (numColIdx !== -1) {
          parsedAmount = parseFloat(cleanCols[numColIdx].replace(/[^\d.-]/g, ''));
          const otherCols = cleanCols.filter((_, idx) => idx !== numColIdx);
          parsedMerchant = otherCols[0] || 'Unknown Recipient';
          parsedCategory = otherCols[1] || 'Other';
        } else {
          parsedAmount = parseFloat(cleanCols[0]?.replace(/[^\d.-]/g, '')) || 0;
          parsedMerchant = cleanCols[1] || 'Unknown Recipient';
          parsedCategory = cleanCols[2] || 'Other';
        }
      }

      if (parsedMerchant && !isNaN(parsedAmount) && parsedAmount > 0) {
        parsedRowsData.push({
          amount: parsedAmount,
          merchant: parsedMerchant,
          category: parsedCategory
        });
      }
    }
    return parsedRowsData;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLoadedFile(file);
    }
  };

  const processLoadedFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const rows = parseCSVText(text);
        setParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLoadedFile(file);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "Amount,Merchant,Category\n" +
      "142000,CryptoX Offshore Arbitrage,Financial Services\n" +
      "8500,Swiggy Bengaluru Food,Food & Beverage\n" +
      "120000,Premium Apple Store Hub,Electronics\n" +
      "32500,Cleartrip Holiday Package,Travel\n" +
      "1500,Netflix India Prime,Entertainment\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FinShield_Sample_Transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkSubmit = async () => {
    if (parsedRows.length === 0) return;
    await onBulkPredict(parsedRows);
    setParsedRows([]);
    setFileName('');
  };

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePredictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || !newMerchant) return;
    
    await onCustomPredict(parsedAmount, newMerchant, newCategory);
    setNewAmount('');
    setNewMerchant('');
    // Keep form open for further evaluations
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      
      {/* Top Search Controls + Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        
        {/* Search Input */}
        <div className="w-full sm:max-w-md relative">
          <label htmlFor="fraud-search" className="sr-only">Search transactions by ID, merchant, status, or category</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="fraud-search"
            type="text"
            placeholder="Search records by ID, merchant, status, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Action Buttons: Custom Prediction & CSV Import */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={() => {
              setShowPredictForm(!showPredictForm);
              if (!showPredictForm) setShowCsvImporter(false);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              showPredictForm 
                ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-blue-500" /> Assess Single Transaction
          </button>
          
          <button
            onClick={() => {
              setShowCsvImporter(!showCsvImporter);
              if (!showCsvImporter) setShowPredictForm(false);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              showCsvImporter 
                ? 'bg-slate-800 text-white hover:bg-slate-950 shadow-sm' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Import CSV Ledger
          </button>
        </div>

      </div>

      {/* Grid container with progressive drawer disclosure */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Transaction Ledger Table */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Custom Form Block Inside Column if activated */}
          <AnimatePresence>
            {showPredictForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-blue-50/40 border-b border-blue-100"
              >
                <form onSubmit={handlePredictSubmit} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-blue-900 block uppercase tracking-wider">
                        🎯 Real-time Transaction Fraud Evaluator
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Input custom transaction particulars below. Our Gemini agent will score the threat risk, explain triggers, and retrieve matching RBI Master Directions.
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowPredictForm(false)} 
                      className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200"
                      title="Hide Check Console"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-blue-100/80 rounded-xl shadow-sm">
                    {/* Amount */}
                    <div className="space-y-1">
                      <label htmlFor="amount" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                        Amount to Evaluate (INR)
                      </label>
                      <input
                        id="amount"
                        type="number"
                        required
                        placeholder="e.g. 150000"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {/* Merchant */}
                    <div className="space-y-1">
                      <label htmlFor="merchant" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                        Merchant / Recipient Name
                      </label>
                      <input
                        id="merchant"
                        type="text"
                        required
                        placeholder="e.g. CryptoX Arbitrage"
                        value={newMerchant}
                        onChange={(e) => setNewMerchant(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {/* Category */}
                    <div className="space-y-1">
                      <label htmlFor="category" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                        Merchant Category
                      </label>
                      <select
                        id="category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loadingPredict}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                    >
                      {loadingPredict ? "AI Model Assessing..." : "Run AI Fraud Assessment"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk CSV Selection Drawer */}
          <AnimatePresence>
            {showCsvImporter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-50 border-b border-slate-200"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-blue-900 block uppercase tracking-wider">
                        📁 Bulk CSV Ledger Risk Assessor
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Select or Drag & Drop a transaction CSV ledger file. The system will parse amounts, categories, and merchants of all records to run rapid sandbox risk assessments.
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowCsvImporter(false)} 
                      className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200 cursor-pointer"
                      title="Hide CSV Console"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50/50 scale-[0.99] shadow-inner' 
                        : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/20'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".csv"
                      className="hidden"
                    />

                    <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                      <Upload className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">
                        {fileName ? `Loaded File: ${fileName}` : "Drag & Drop CSV File Here"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        or click to browse local folders
                      </p>
                    </div>
                  </div>

                  {/* Template download helper */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        Expected Columns: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">Amount</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">Merchant</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">Category</code>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadSample}
                      className="text-[10px] inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs cursor-pointer transition-colors"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" /> Download Sample CSV
                    </button>
                  </div>

                  {/* Preview of Parsed Rows */}
                  {parsedRows.length > 0 && (
                    <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">
                          Transactions Identified ({parsedRows.length} items parsed)
                        </span>
                        <button 
                          onClick={() => {
                            setParsedRows([]);
                            setFileName('');
                          }} 
                          className="text-[10px] text-red-650 font-bold hover:underline cursor-pointer"
                        >
                          Clear File
                        </button>
                      </div>

                      <div className="max-h-36 overflow-y-auto text-left text-xs divide-y divide-slate-150">
                        {parsedRows.slice(0, 15).map((row, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-705 block">{row.merchant}</span>
                              <span className="text-[10px] text-slate-400 block">{row.category || 'Other'}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-805">
                              {row.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        ))}
                        {parsedRows.length > 15 && (
                          <div className="text-center py-1.5 text-[10px] text-slate-400 font-medium italic">
                            ... and {parsedRows.length - 15} more records parsed successfully.
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleBulkSubmit}
                          disabled={loadingPredict}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold leading-none cursor-pointer inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {loadingPredict ? "AI Executing Bulk Assessment..." : `Assess ${parsedRows.length} Ledger Items`}
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Merchant</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">Risk Index</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      {"No transaction logs match search filters. Toggle the 'Peak Traffic Simulator' to stream live traffic."}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isSelected = selectedTransaction && selectedTransaction.id === tx.id;
                    return (
                      <tr
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className={`hover:bg-slate-50 cursor-pointer transition-all ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-medium text-slate-500">
                          {tx.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <span className="block">{tx.merchant}</span>
                          <span className="text-[10px] font-normal text-slate-400 block mt-0.5">{tx.category}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              tx.riskScore > 75 ? 'bg-red-500' : tx.riskScore > 50 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`} />
                            <span className="font-mono">{tx.riskScore}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'Approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : tx.status === 'Flagged'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTransaction(tx);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                          >
                            Analyze <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE DRAWER with slide-in animation */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0, x: 280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 280 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="w-full lg:w-96 bg-white border border-slate-200 shadow-xl rounded-xl p-5 space-y-5 shrink-0"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Transaction Audit</span>
                  <span className="text-base font-extrabold text-slate-800">{selectedTransaction.id}</span>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status and Risk meter */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Security Score</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    selectedTransaction.status === 'Approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedTransaction.status === 'Flagged'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Risk Score:</span>
                    <strong className="text-slate-700">{selectedTransaction.riskScore}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedTransaction.riskScore > 75 ? 'bg-red-500' : selectedTransaction.riskScore > 50 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${selectedTransaction.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-1.5 border-t border-slate-200/50">
                  <span className="text-slate-500 font-medium">Fraud Probability:</span>
                  <strong className="font-mono text-slate-700">{selectedTransaction.fraudProbability}</strong>
                </div>
              </div>

              {/* Details sections */}
              <div className="space-y-3">
                {/* Explanation */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Incident explanation</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/55 p-2 rounded">
                    {selectedTransaction.explanation || "No explanatory telemetry available. Operational metrics verified."}
                  </p>
                </div>

                {/* Suggested Action */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-amber-600 font-bold block">Suggested Action</span>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed bg-amber-50/40 p-2 border border-amber-100 rounded">
                    {selectedTransaction.suggestedAction || "Clear normal operations."}
                  </p>
                </div>

                {/* AI Reasoning */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-blue-600 font-bold block flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" /> AI-Generated Reasoning
                  </span>
                  <p className="text-xs text-slate-600 leading-normal italic pl-2.5 border-l-2 border-blue-500">
                    {selectedTransaction.aiReasoning || "Standard trusted transaction coordinates matching general account metrics."}
                  </p>
                </div>

                {/* Retrieved RBI Guideline */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-emerald-600 font-bold block flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Retrieved RBI Compliance Code
                  </span>
                  <p className="text-xs text-slate-700 font-mono bg-emerald-50/40 p-2 border border-emerald-100 rounded">
                    {selectedTransaction.retrievedRule || "Master Guidelines Section 4: Secure Ledger Operational Parameter Clearances."}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={onCloseDrawer}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Dismiss Audit View
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
