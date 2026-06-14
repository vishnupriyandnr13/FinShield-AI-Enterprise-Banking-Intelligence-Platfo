import React from 'react';
import { Home, Zap, Shield, MessageSquare, FileText, BarChart3, Settings, ChevronLeft, ChevronRight, Server, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  simulationActive: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, simulationActive }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'guide', label: 'System User Guide', icon: BookOpen },
    { id: 'simulator', label: 'Peak Traffic Simulator', icon: Zap, badge: simulationActive ? 'LIVE' : undefined },
    { id: 'fraud', label: 'Fraud Analysis', icon: Shield },
    { id: 'compliance', label: 'AI Compliance Assistant', icon: MessageSquare },
    { id: 'statement', label: 'Statement Analyzer', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1">
        {/* Workspace Brand / Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-base tracking-tight block">FinShield AI</span>
                <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Enterprise Suite</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto bg-blue-600 text-white p-1.5 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500 text-white rounded font-bold tracking-widest animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="p-4 border-t border-slate-100 text-center">
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-[11px] font-semibold text-slate-500">Live Production Node</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">v1.2.6_COFT</p>
          </div>
        ) : (
          <div className="mx-auto w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Production Node Online"></div>
        )}
      </div>
    </div>
  );
}
