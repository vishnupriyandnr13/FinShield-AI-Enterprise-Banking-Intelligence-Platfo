import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  Search, 
  TrendingUp, 
  BadgeAlert,
  Terminal,
  RefreshCw
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import UserGuideView from './components/UserGuideView';
import DashboardView from './components/DashboardView';
import TrafficSimulatorView from './components/TrafficSimulatorView';
import FraudAnalysisView from './components/FraudAnalysisView';
import ComplianceAssistantView from './components/ComplianceAssistantView';
import StatementAnalyzerView from './components/StatementAnalyzerView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import FloatingAI from './components/FloatingAI';
import { Transaction, SimulationConfig, SimulationStats, ChatMessage, StatementAnalysis } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Live Operations State
  const [kpis, setKpis] = useState({
    transactionsProcessed: 1420,
    fraudAlerts: 18,
    averageRiskScore: 12.4,
    systemHealth: 'Optimal'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [simConfig, setSimConfig] = useState<SimulationConfig>({
    scenario: "Normal Banking Day",
    tps: 120,
    fraudRate: 1.5,
    active: false
  });
  const [simStats, setSimStats] = useState<SimulationStats>({
    currentTps: 120,
    fraudCount: 0,
    successRate: 98.5,
    processingLatency: 8.4
  });

  // Feature specific states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [statementAnalysis, setStatementAnalysis] = useState<StatementAnalysis | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Loaders and Error handling
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [loadingStatement, setLoadingStatement] = useState<boolean>(false);
  const [loadingPredict, setLoadingPredict] = useState<boolean>(false);
  const [errorScreen, setErrorScreen] = useState<string | null>(null);

  // Toast notifications State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Show customized toast alert
  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch standard dashboard values
  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error("Could not connect to API server.");
      const data = await res.json();
      setKpis(data.kpis);
      setTransactions(data.transactions);
      setSimConfig(data.simulationConfig);
      setSimStats(data.simulationStats);
      setErrorScreen(null);
    } catch (e: any) {
      console.error(e);
      setErrorScreen("Could not contact FinShield API Gateway. Please verify the backend container status.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch full analytical reports
  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error("Analytics retrieval failed.");
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchDashboard();
    fetchAnalytics();
  }, []);

  // Polling update loop during active peak traffic simulations
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simConfig.active) {
      interval = setInterval(() => {
        fetchDashboard();
        // Fetch background stats without heavy loading flickers
        fetch('/api/analytics')
          .then(res => res.json())
          .then(data => setAnalyticsData(data))
          .catch(() => {});
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simConfig.active]);

  // Start traffic experiment simulation
  const handleStartSimulation = async (cfg: SimulationConfig) => {
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cfg, active: true })
      });
      const data = await res.json();
      setSimConfig(data.config);
      setSimStats(data.stats);
      showToast(`Simulation launched: ${cfg.scenario} operating under ${cfg.tps.toLocaleString()} TPS!`, 'success');
    } catch {
      showToast("Could not communicate simulation activation.", 'alert');
    }
  };

  // Stop traffic experiment simulation
  const handleStopSimulation = async () => {
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...simConfig, active: false })
      });
      const data = await res.json();
      setSimConfig(data.config);
      setSimStats(data.stats);
      showToast("Simulation suspended. Traffic routing set to standard operational baseline.", 'info');
    } catch {
      showToast("Could not contact API to stop simulation.", 'alert');
    }
  };

  // Custom AI Transaction Prediction (POST /api/predict)
  const handleCustomPredict = async (amount: number, merchant: string, category: string) => {
    try {
      setLoadingPredict(true);
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, merchant, category })
      });
      if (!res.ok) throw new Error("Evaluation error.");
      const data = await res.json();
      
      // Update local transaction logs instantly
      setTransactions(prev => [data.transaction, ...prev]);
      setSelectedTransaction(data.transaction); // Open Right Drawer automatically
      showToast(`AI evaluated ${merchant}: Score ${data.transaction.riskScore}% (${data.transaction.status})`, 'info');
    } catch {
      showToast("Predictive modeling request failed.", 'alert');
    } finally {
      setLoadingPredict(false);
    }
  };

  // Bulk CSV Transaction Prediction (POST /api/predict-bulk)
  const handleBulkPredict = async (parsedTxs: { amount: number; merchant: string; category?: string }[]) => {
    try {
      setLoadingPredict(true);
      const res = await fetch('/api/predict-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: parsedTxs })
      });
      if (!res.ok) throw new Error("Bulk evaluation error.");
      const data = await res.json();
      
      if (data.success && data.transactions.length > 0) {
        // Update local logs
        setTransactions(prev => [...data.transactions, ...prev]);
        setSelectedTransaction(data.transactions[0]); // Select first to show analysis drawer
        showToast(`Successfully analyzed ${data.processedCount} CSV transactions!`, 'success');
      } else {
        showToast("No valid transactions found in uploaded CSV.", 'info');
      }
    } catch {
      showToast("Bulk predictive modeling request failed.", 'alert');
    } finally {
      setLoadingPredict(false);
    }
  };

  // Chat message submission (POST /api/chat)
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatHistory, userMsg] })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, replyMsg]);
    } catch {
      showToast("AI Copilot compliance connection failed.", 'alert');
    } finally {
      setLoadingChat(false);
    }
  };

  // Statement analyzer visual OCR parser (POST /api/upload)
  const handleAnalyzeStatement = async (fileData: string, fileType: string, fileName: string) => {
    try {
      setLoadingStatement(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType, fileData })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStatementAnalysis(data.analysis);
      showToast(`Successfully extracted ${fileName} via Gemini Vision OCR API!`, 'success');
    } catch {
      showToast("OCR processing error. Initializing fallback bank template format...", 'info');
      // trigger secondary demo upload representation safely
      const demoRes = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileData: "fallback" }) });
      const demoData = await demoRes.json();
      setStatementAnalysis(demoData.analysis);
    } finally {
      setLoadingStatement(false);
    }
  };

  // Assistant Quick Floating dialogue trigger
  const handleFloatingQuickChat = async (text: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', text }] })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.reply;
    } catch {
      return "Online checks are running on standby. Verify core ledger metrics from Dashboard.";
    }
  };

  // Export Transactions as CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast("No records available to export.", 'info');
      return;
    }
    const headers = "Transaction ID,Time,Merchant,Amount (INR),Risk Score,Decision,Category\n";
    const rows = transactions.map(t => 
      `"${t.id}","${t.time}","${t.merchant.replace(/"/g, '""')}",${t.amount},${t.riskScore},"${t.status}","${t.category}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FinShield_Audit_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV ledger successfully compiled and downloaded.", 'success');
  };

  // Export / Print report
  const handleTriggerPrint = () => {
    window.print();
  };

  // Helper mapping search bar queries
  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-700 font-sans flex text-left relative selection:bg-blue-500 selection:text-white">
      
      {/* Collapsible Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // clear search query on view switch to prevent data hideout
          setGlobalSearch('');
        }} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        simulationActive={simConfig.active}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header / Navigation */}
        <TopNav 
          onSearch={handleGlobalSearch} 
          fraudAlertsCount={transactions.filter(t => t.status !== 'Approved').length} 
          systemHealth={kpis.systemHealth}
        />

        {/* Dynamic Warning Notification banner if Peak Traffic simulation active */}
        {simConfig.active && (
          <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-between text-xs font-semibold select-none shadow-sm shadow-amber-500/10">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>EXPERIMENTAL FLOW RUNNING: <strong>{simConfig.scenario}</strong> limit is configured at <strong>{simConfig.tps.toLocaleString()} TPS</strong> ({simConfig.fraudRate}% calculated threat velocity).</span>
            </div>
            <button 
              onClick={handleStopSimulation}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] uppercase font-extrabold cursor-pointer border border-white/20"
            >
              Halt Simulator
            </button>
          </div>
        )}

        {/* Actual view containers */}
        <main className="p-6 flex-1 min-h-[calc(100vh-4rem)]">
          
          {/* Error Fallback Panel */}
          {errorScreen ? (
            <div className="max-w-md mx-auto my-12 bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-800">Connection Interrupted</h3>
                <p className="text-xs text-slate-500 leading-normal">{errorScreen}</p>
              </div>
              <button
                onClick={fetchDashboard}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Retry Handshake
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                
                {/* 1. Dashboard View */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-xl font-bold text-slate-800">FinShield AI Central Operations</h1>
                        <p className="text-xs text-slate-500">Real-time enterprise banking transactions audit ledger & risk monitoring.</p>
                      </div>
                      
                      {/* Interactive PDF/CSV Export buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExportCSV}
                          className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                          title="Export standard CSV stream"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> <span className="hidden sm:inline">Export CSV</span>
                        </button>
                        <button
                          onClick={handleTriggerPrint}
                          className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                          title="Print platform viewport diagnostics"
                        >
                          <Printer className="w-4 h-4 text-slate-500" /> <span className="hidden sm:inline">Print Diagnostic</span>
                        </button>
                      </div>
                    </div>

                    <DashboardView
                      kpis={kpis}
                      transactions={
                        globalSearch 
                          ? transactions.filter(t => t.id.toLowerCase().includes(globalSearch.toLowerCase()) || t.merchant.toLowerCase().includes(globalSearch.toLowerCase())) 
                          : transactions
                      }
                      loading={loadingDashboard}
                      onViewAllTransactions={() => setActiveTab('fraud')}
                      onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                    />
                  </div>
                )}

                {/* 1.5. System User Guide Handbook */}
                {activeTab === 'guide' && (
                  <UserGuideView onNavigate={setActiveTab} />
                )}

                {/* 2. Peak Traffic Simulator Step Wizard */}
                {activeTab === 'simulator' && (
                  <TrafficSimulatorView
                    config={simConfig}
                    stats={simStats}
                    onStartSimulation={handleStartSimulation}
                    onStopSimulation={handleStopSimulation}
                  />
                )}

                {/* 3. Fraud Analysis Audit Deck */}
                {activeTab === 'fraud' && (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-xl font-bold text-slate-800">Fraud Analysis Isolation Deck</h1>
                      <p className="text-xs text-slate-500">Live incoming ledger. Click on any transaction entry to inspect risk scores and compliance rules.</p>
                    </div>

                    <FraudAnalysisView
                      transactions={
                        globalSearch 
                          ? transactions.filter(t => t.id.toLowerCase().includes(globalSearch.toLowerCase()) || t.merchant.toLowerCase().includes(globalSearch.toLowerCase())) 
                          : transactions
                      }
                      selectedTransaction={selectedTransaction}
                      onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                      onCloseDrawer={() => setSelectedTransaction(null)}
                      onCustomPredict={handleCustomPredict}
                      onBulkPredict={handleBulkPredict}
                      loadingPredict={loadingPredict}
                    />
                  </div>
                )}

                {/* 4. AI Compliance Assistant Chat */}
                {activeTab === 'compliance' && (
                  <div className="space-y-4">
                    <div className="text-center sm:text-left">
                      <h1 className="text-xl font-bold text-slate-800">Sovereign Compliance Assistant</h1>
                      <p className="text-xs text-slate-500">Obtain real-time legal interpretation regarding RBI guidelines, KYC rules, and Suspicious Transaction filing protocols.</p>
                    </div>
                    <ComplianceAssistantView
                      chatHistory={chatHistory}
                      onSendMessage={handleSendMessage}
                      loading={loadingChat}
                    />
                  </div>
                )}

                {/* 5. Statement Analyzer Panel */}
                {activeTab === 'statement' && (
                  <StatementAnalyzerView
                    onAnalyze={handleAnalyzeStatement}
                    analysis={statementAnalysis}
                    loading={loadingStatement}
                  />
                )}

                {/* 6. Analytics Visual Report Panel */}
                {activeTab === 'analytics' && (
                  <AnalyticsView
                    data={analyticsData}
                    loading={loadingAnalytics}
                  />
                )}

                {/* 7. Settings View Panel */}
                {activeTab === 'settings' && (
                  <SettingsView
                    apiKeyActive={!!process.env.GEMINI_API_KEY}
                  />
                )}

              </motion.div>
            </AnimatePresence>
          )}

        </main>
      </div>

      {/* Floating AI Assistant overlay trigger */}
      <FloatingAI onQuickChat={handleFloatingQuickChat} />

      {/* Custom Bottom Left Toast Notifier */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: 50 }}
            className={`fixed bottom-6 left-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm border ${
              toast.type === 'success' 
                ? 'bg-emerald-900 border-emerald-800 text-white' 
                : toast.type === 'alert'
                ? 'bg-red-900 border-red-800 text-white'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Wifi className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-[11px] font-bold leading-normal">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/15 rounded text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
