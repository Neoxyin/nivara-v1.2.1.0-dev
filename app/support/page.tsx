'use client';

import { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { LockKeyhole, Sparkles, Send } from 'lucide-react';
import { sendSupportMessage } from '@/lib/api/support';

const QUICK_PROMPTS = ['Make a study plan', 'I feel stretched', 'Find a person to talk with'];

export default function SupportPage() {
  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      text: "I'm here. What would feel most useful right now — making a study plan, clearing some mental space, or finding a person to talk with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text = input) => {
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
  };

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

        <div className="grid grid-cols-[1fr_.38fr] gap-3">
          {/* Chat panel */}
          <section className="flex min-h-[580px] flex-col border border-white/[0.09] bg-[hsl(var(--card))]">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(195,243,64,.10)] text-[#dce8d8]">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-[13px] font-semibold">Nivara guide</p>
                <p className="serenity-label text-[8px] text-white/35">Practical, not clinical</p>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-[#c3f340] shadow-[0_0_10px_rgba(195,243,64,.7)]" />
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-support-${i}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm leading-6 ${
                      m.from === 'you'
                        ? 'bg-[#1e1e1e] text-white/90'
                        : 'bg-[#161916] text-white/60'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-[#161916] px-4 py-3">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="inline-block h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse"
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
            <div className="border-t border-white/[0.08] p-4">
              <div className="mb-3 flex gap-2">
                {QUICK_PROMPTS.map((x) => (
                  <button
                    key={x}
                    onClick={() => send(x)}
                    data-testid={`button-support-prompt-${x}`}
                    className="border border-white/[0.09] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.06em] text-white/40 transition-[border-color,color] duration-150 hover:border-white/20 hover:text-white/70"
                  >
                    {x}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-testid="input-support-message"
                  placeholder="Write what's on your mind..."
                  className="flex-1 border border-white/[0.09] bg-transparent px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-[#c3f340]/40 transition-colors duration-150"
                />
                <button
                  onClick={() => send()}
                  disabled={sending || !input.trim()}
                  className="border border-[#c3f340]/30 bg-[#141414] px-4 py-3 text-[#dff77d] transition-[opacity,border-color] duration-150 hover:border-[#c3f340]/60 disabled:opacity-30"
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-3">
            <div className="border border-white/[0.09] bg-[#141414] p-6">
              <p className="serenity-label text-white/40">What this space is for</p>
              <p className="mt-4 text-sm leading-6 text-white/50">
                Practical support: study planning, stress strategies, and help finding the right person. Not a clinical service.
              </p>
            </div>
            <div className="border border-white/[0.09] bg-[hsl(var(--card))] p-6">
              <p className="serenity-label text-white/40">Need a person?</p>
              <p className="mt-4 text-sm leading-6 text-white/50">
                If you'd prefer to talk with someone directly, your institution's counsellors are a short step away.
              </p>
              <a
                href="/counsellors"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#dff77d] transition-opacity hover:opacity-70"
              >
                View counsellors →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export const dynamic = 'force-dynamic';
