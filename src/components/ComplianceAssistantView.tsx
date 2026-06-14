import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, User, ShieldCheck, Compass, AlertTriangle, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types.js';

interface ComplianceAssistantViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading: boolean;
}

export default function ComplianceAssistantView({
  chatHistory,
  onSendMessage,
  loading
}: ComplianceAssistantViewProps) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Why was TXN-100000 flagged?",
    "Explain RBI KYC requirements.",
    "Summarize AML policy guidelines.",
    "How should suspicious transactions be handled?"
  ];

  // Auto-scroll to lowest chat message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestedClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Bot Chat Header Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 block">FinShield AI Compliance Copilot</span>
            <span className="text-[10px] text-slate-400 block font-semibold">RBI Sovereign Regulation RAG Engine • Live</span>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
          Model: gemini-3.5-flash
        </span>
      </div>

      {/* Conversations Scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          /* Empty Chat Screen with suggested prompts */
          <div className="h-full flex flex-col justify-center items-center text-center max-w-md mx-auto space-y-6">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-800">RAG Compliance & Regulation Desk</h2>
              <p className="text-xs text-slate-500">
                Discuss RBI Master Directions, KYC mandates, Suspicious Transaction Reports (STRs), and AML parameters.
              </p>
            </div>

            {/* Prompt Quick Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2 text-left">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedClick(prompt)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-all cursor-pointer text-left flex items-start justify-between gap-1 group"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-4">
            {chatHistory.map((item) => {
              const isUser = item.role === 'user';
              return (
                <div
                  key={item.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Account icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isUser ? 'bg-blue-600' : 'bg-slate-800'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </div>

                  {/* Text box */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-800 border border-slate-200/50'
                  }`}>
                    {/* Render message formatting preserves returns */}
                    <div className="whitespace-pre-wrap select-text font-medium">
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Waiting loader */}
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-800 text-white">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input controls container */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="compliance-chat" className="sr-only">Type your compliance questions here</label>
          <input
            id="compliance-chat"
            type="text"
            required
            placeholder="Query KYC, explain suspicious filings, search Master Directions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl cursor-pointer transition-all disabled:opacity-50 select-none"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
          FinShield uses sovereign AI data layers. Verify details with audit checklists.
        </p>
      </div>

    </div>
  );
}
