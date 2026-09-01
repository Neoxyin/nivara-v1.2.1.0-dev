'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Compass, 
  UsersRound, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  ArrowUpRight,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';
import { sendAiSupportMessage } from '@/lib/api/support';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I am your Nivara Support Navigator. I'm here to help you explore campus resources, talk through academic pacing, or connect with a campus counsellor. How are you feeling today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const QUICK_PROMPTS = [
  "I'm feeling overwhelmed with upcoming deadlines",
  "How do I schedule a confidential 1-on-1 session?",
  "Tips for balancing sleep and coursework",
  "Where can I find stress management resources?"
];

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedConversation = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasStartedConversation.current) scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const content = textToSend || input;
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    hasStartedConversation.current = true;
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await sendAiSupportMessage({
        messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm here to support you. Let me know if you would like to explore our well-being guides or speak with a counsellor.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('We encountered an issue reaching the support assistant. Please try again or visit our counsellor booking page.');
      // Add fallback assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having a little trouble connecting right now, but your well-being matters. You can always browse our resource library or connect directly with a counsellor below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chat Area */}
      <div className={`lg:col-span-3 flex flex-col border border-white/[0.09] bg-[#141414]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transition-[height] duration-300 ease-out ${hasStartedConversation.current ? 'h-[620px]' : 'h-auto'}`}>
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20 shadow-inner">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">AI Support Space</h3>
              <p className="text-xs text-white/50 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#c3f340] animate-pulse" />
                Supportive resource navigation & pacing reflections
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMessages([]); setInput(''); setErrorMessage(null); hasStartedConversation.current = false; }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/10 transition-colors"
              title="Clear current conversation"
            >
              <RefreshCw size={13} />
              <span>Clear conversation</span>
            </button>
            <Link 
              href="/counsellors" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/10 transition-colors"
            >
              <UsersRound size={13} /> Counsellors
            </Link>
            <Link 
              href="/resources" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/10 transition-colors"
            >
              <Compass size={13} /> Resources
            </Link>
          </div>
        </div>
        <div className="border-b border-white/[0.06] bg-white/[0.015] px-6 py-3 text-[11px] leading-5 text-white/45">
          <span className="font-semibold text-white/70">Conversation context:</span> this chat uses the conversation messages you provide to support resource navigation. Clearing the conversation removes the current chat context from this student-side prototype. It does not change data permissions or assessment history.
        </div>

        {/* Message Scroll Area */}
        <div className={`overflow-y-auto p-6 space-y-6 ${hasStartedConversation.current ? 'flex-1 min-h-0' : 'max-h-[260px]'}`}>
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-white/40 p-8">
              <div>
                <HeartHandshake size={40} className="mx-auto mb-3 text-white/20" />
                <p className="text-sm font-medium">Start a supportive conversation...</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3.5 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  msg.role === 'user' 
                    ? 'bg-[#c3f340] text-black' 
                    : 'bg-white/[0.08] text-[#c3f340] border border-white/10'
                }`}>
                  {msg.role === 'user' ? <User size={15} /> : <Bot size={16} />}
                </div>

                <div className={`space-y-1.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#c3f340] text-black font-medium rounded-tr-none'
                      : 'bg-white/[0.05] text-white/90 border border-white/[0.08] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-white/30 px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3.5 max-w-[75%]">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[#c3f340] border border-white/10">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.05] text-white/70 border border-white/[0.08] flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-[#c3f340]" />
                <span className="text-xs">Finding supportive resources...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-6 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 shrink-0">Quick ask:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white/70 hover:text-white transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#141414]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <textarea
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about resources, study pacing, or support options..."
              disabled={isLoading}
              aria-label="Support message input"
              className="flex-1 min-h-11 max-h-32 resize-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c3f340]/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#c3f340] text-black font-semibold hover:bg-[#dff77d] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#c3f340]/10"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-white/40 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#c3f340]" />
              Supportive guidance only · Not a medical, financial, or academic authority
            </span>
            <span>Enter to send · Shift+Enter for a new line</span>
          </div>
        </div>

      </div>

      {/* Sidebar Quick Resources */}
      <div className="space-y-4">
        <div className="border border-white/[0.09] bg-[#141414]/90 p-5 backdrop-blur-xl rounded-2xl space-y-4">
          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
            <Compass size={16} className="text-[#c3f340]" />
            Quick Connections
          </h4>
          <p className="text-xs text-white/60 leading-relaxed">
            Need direct human support? You can connect with campus professionals at any time.
          </p>

          <div className="space-y-2.5">
            <Link 
              href="/counsellors" 
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <UsersRound size={15} className="text-[#c3f340]" />
                <span className="text-xs font-medium text-white/90">Counsellor Sessions</span>
              </div>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#c3f340] transition-colors" />
            </Link>

            <Link 
              href="/resources" 
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Compass size={15} className="text-[#c3f340]" />
                <span className="text-xs font-medium text-white/90">Well-being Library</span>
              </div>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#c3f340] transition-colors" />
            </Link>

            <Link 
              href="/financial-support" 
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-[#c3f340]" />
                <span className="text-xs font-medium text-white/90">Financial Support</span>
              </div>
              <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#c3f340] transition-colors" />
            </Link>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] p-4 rounded-xl space-y-2">
          <h5 className="text-xs font-semibold text-white/80">Confidentiality & Care</h5>
          <p className="text-[11px] text-white/50 leading-relaxed">
            Conversations in the AI Support Space are private and designed solely to assist your navigation of campus support services.
          </p>
        </div>
      </div>
    </div>
  );
}
