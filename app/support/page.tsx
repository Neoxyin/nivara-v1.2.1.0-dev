'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { LockKeyhole, Sparkles, Send, ArrowUpRight } from 'lucide-react';
import { sendSupportMessage } from '@/lib/api/support';

const QUICK_PROMPTS = ['Make a study plan', 'I feel stretched', 'Find a person to talk with'];

function SupportContent() {
  const searchParams = useSearchParams();
  const promptParam = searchParams.get('prompt');
  const hasHandledPromptRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      text: "I'm here. What would feel most useful right now — making a study plan, clearing some mental space, or finding a person to talk with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setInput('');
    setMessages((m) => [...m, { from: 'you', text: trimmed }]);

    try {
      const response = await sendSupportMessage(trimmed);
      setMessages((m) => [...m, { from: 'assistant', text: response.response }]);
    } finally {
      setSending(false);
    }
  }, [input, sending]);

  useEffect(() => {
    if (promptParam && promptParam.trim() && !hasHandledPromptRef.current) {
      hasHandledPromptRef.current = true;
      send(promptParam.trim());
    }
  }, [promptParam, send]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Support space"
          title="A place to think out loud."
          description="Practical guidance for study planning, stress, reflection, and finding support. Nivara is not a medical service or a replacement for a counsellor."
          action={
            <Pill tone="accent">
              <LockKeyhole size={12} className="mr-1" /> Private space
            </Pill>
          }
        />

        <div className="grid grid-cols-[1fr_.38fr] gap-4 items-start">
          {/* Chat panel */}
          <section className="flex h-[calc(100vh-230px)] min-h-[480px] max-h-[600px] flex-col border border-white/[0.09] bg-[hsl(var(--card))]/95 backdrop-blur-2xl rounded-lg overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-3.5 bg-white/[0.01] shrink-0">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(195,243,64,.15)] text-[#c3f340] shadow-[0_0_12px_rgba(195,243,64,0.3)]">
                <Sparkles size={15} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Nivara guide</p>
                <p className="serenity-label text-[8px] text-white/35">Practical, not clinical</p>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-[#c3f340] shadow-[0_0_10px_rgba(195,243,64,.9)] animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-support-${i}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-6 transition-all duration-200 ${
                      m.from === 'you'
                        ? 'bg-[#1e1e1e] text-white/95 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                        : 'bg-[#161916] text-white/70 border border-white/[0.06]'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-[#161916] px-4 py-3 rounded-lg border border-white/[0.06]">
                    <span className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-[#c3f340] animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/[0.08] p-4 bg-white/[0.01] shrink-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((x) => (
                  <Magnetic key={x}>
                    <button
                      onClick={() => send(x)}
                      data-testid={`button-support-prompt-${x}`}
                      className="border border-white/[0.09] bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.06em] text-white/50 transition-all duration-150 hover:border-[#c3f340]/40 hover:text-white rounded"
                    >
                      {x}
                    </button>
                  </Magnetic>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-testid="input-support-message"
                  placeholder="Write what's on your mind..."
                  className="flex-1 border border-white/[0.09] bg-white/[0.02] px-4 py-2.5 text-sm text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150 rounded"
                />
                <Magnetic>
                  <button
                    onClick={() => send()}
                    disabled={sending || !input.trim()}
                    className="border border-[#c3f340]/40 bg-[#141414] px-4 py-2.5 text-[#dff77d] transition-all duration-150 hover:bg-[#c3f340] hover:text-[#0d1408] disabled:opacity-30 rounded shadow-[0_0_12px_rgba(195,243,64,0.2)]"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </Magnetic>
              </div>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-3">
            <TiltCard maxTilt={3} className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl">
              <p className="serenity-label text-white/40">What this space is for</p>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                Practical support: study planning, stress strategies, and help finding the right person. Not a clinical service.
              </p>
            </TiltCard>
            <TiltCard maxTilt={3} spotlightColor="rgba(195, 243, 64, 0.12)" className="border border-white/[0.09] bg-[hsl(var(--card))]/90 p-6 backdrop-blur-xl">
              <p className="serenity-label text-[#c3f340]">Need a person?</p>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                If you&apos;d prefer to talk with someone directly, your institution&apos;s counsellors are a short step away.
              </p>
              <Magnetic>
                <Link
                  href="/counsellors"
                  className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-75"
                >
                  View available counsellors <ArrowUpRight size={12} />
                </Link>
              </Magnetic>
            </TiltCard>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
