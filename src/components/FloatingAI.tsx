import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, ShieldAlert, BadgeHelp, HelpCircle } from 'lucide-react';

interface FloatingAIProps {
  onQuickChat: (text: string) => Promise<string>;
}

export default function FloatingAI({ onQuickChat }: FloatingAIProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; role: 'user' | 'model'; text: string }>>([
    { id: 1, role: 'model', text: "Hello Auditor! I am your quick compliance RAG assistant. Ask me anything about suspicious payments or RBI KYC guidelines." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await onQuickChat(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', text: "Network connection is recovering. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-80 sm:w-96 h-96 flex flex-col overflow-hidden mb-4 mr-1"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1 rounded-md text-white">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">FinShield AI Quick Guard</span>
                  <span className="text-[9px] text-slate-400 block">Ground-level RBI KYC & AML Copilot</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chats */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-800 font-medium shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-2 bg-slate-200 rounded-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-2 border-t border-slate-100 bg-white flex gap-1.5">
              <label htmlFor="quick-assistant-chat" className="sr-only">Ask Quick assistant</label>
              <input
                id="quick-assistant-chat"
                type="text"
                required
                placeholder="Ask quick compliance checks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer transition-all border border-blue-500/10 focus:outline-none"
        title="Quick AI Guard Helpdesk"
      >
        <Sparkles className="w-5 h-5 fill-current" />
      </motion.button>
    </div>
  );
}
