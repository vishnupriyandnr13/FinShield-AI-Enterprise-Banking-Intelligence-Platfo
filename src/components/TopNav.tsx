import React, { useState } from 'react';
import { Search, Bell, AlertTriangle, ShieldCheck, CheckCircle2, User } from 'lucide-react';

interface TopNavProps {
  onSearch: (query: string) => void;
  fraudAlertsCount: number;
  systemHealth: string;
}

export default function TopNav({ onSearch, fraudAlertsCount, systemHealth }: TopNavProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Potential Velocity Exploit",
      desc: "TXN-941865 was flagged as anomalous due to high TPS rate checks from Swiggy.",
      time: "Just now",
      type: "alert"
    },
    {
      id: 2,
      title: "Compliance Report Drafted",
      desc: "RBI Master circular KYC Section 12 check compiled automatically.",
      time: "2 mins ago",
      type: "info"
    },
    {
      id: 3,
      title: "System Threshold Normal",
      desc: "Throughput metrics stabilized after normal clearing operations.",
      time: "15 mins ago",
      type: "success"
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value); // Realtime filtering
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative hidden sm:block">
        <label htmlFor="top-search" className="sr-only">Search transactions, merchants, and policies</label>
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          id="top-search"
          type="text"
          placeholder="Global search transactions, merchants, or systems..."
          value={searchVal}
          onChange={handleInputChange}
          className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-150"
        />
      </form>

      {/* Right Navigation controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* System Health Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-600">
          <span className={`w-2 h-2 rounded-full ${systemHealth === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500 animation-pulse'}`}></span>
          <span>Node Status: <strong className="text-slate-800">{systemHealth}</strong></span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View system alerts"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {fraudAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {fraudAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-black/5 py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600" /> Notifications
                </span>
                {fraudAlertsCount > 0 && (
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {fraudAlertsCount} Alert(s)
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {notif.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Clear Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="hidden md:block leading-none">
            <span className="text-sm font-semibold text-slate-700 block text-left">Vishnupriyan DnR</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">V-CIP Security Auditor</span>
          </div>
        </div>
      </div>
    </header>
  );
}
