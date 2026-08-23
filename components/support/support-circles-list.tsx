'use client';

import React, { useState } from 'react';
import { 
  UsersRound, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Compass,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import type { SupportCircle } from '@/lib/data/support-circles';
import { getSupportCircles, toggleCircleJoin } from '@/lib/api/support-circles';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';

export function SupportCirclesList() {
  const [circles, setCircles] = useState<SupportCircle[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  React.useEffect(() => {
    getSupportCircles().then(setCircles);
  }, []);

  const categories = ['all', 'Exam Stress', 'First-Year Homesickness', 'Placement Anxiety', 'Hostel Loneliness', 'Academic Burnout'];

  const filteredCircles = filterCategory === 'all' 
    ? circles 
    : circles.filter(c => c.category === filterCategory);

  const handleToggleJoin = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const updated = await toggleCircleJoin(id);
      setCircles(prev => prev.map(c => c.id === id ? updated : c));
    } catch {
      // Graceful fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Moderation & Temporary Banner */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[rgba(195,243,64,.12)] text-[#c3f340] border border-[#c3f340]/20">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-base">Moderated & Temporary Peer Support</h4>
            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              Support circles are purpose-specific, membership-limited (max 12–15 members), and automatically expire after 14 days to encourage healthy transitions and human connection. All posts pass through a supportive safety review layer.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">Active Status</span>
            <span className="text-xs font-semibold text-[#c3f340]">Encrypted & Confidential</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-medium text-white/40 flex items-center gap-1 shrink-0 mr-1">
          <Filter size={13} /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-[#c3f340] text-black font-semibold shadow-md shadow-[#c3f340]/10'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] border border-white/[0.08]'
            }`}
          >
            {cat === 'all' ? 'All Circles' : cat}
          </button>
        ))}
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCircles.map((circle) => {
          const isFull = circle.memberCount >= circle.maxMembers && !circle.isJoined;

          return (
            <div key={circle.id} className="stagger-item">
              <TiltCard maxTilt={2} className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-2xl shadow-xl justify-between">
                
                {/* Card Top */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-2.5 py-1 rounded-md">
                      {circle.category}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1 font-medium">
                      <Clock size={13} className="text-[#c3f340]" /> Expires in {circle.expiresInDays}d
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-lg tracking-tight">{circle.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                      {circle.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {circle.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-white/[0.04] text-white/60 border border-white/[0.07] px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Actions */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <UsersRound size={14} className="text-[#c3f340]" />
                      {circle.memberCount} / {circle.maxMembers} members
                    </span>
                    <span className="text-[11px] text-white/40">Mod: {circle.moderator.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {circle.isJoined ? (
                      <Link
                        href={`/support/circles/${circle.id}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#c3f340] text-black text-xs font-semibold hover:bg-[#dff77d] transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-[#c3f340]/10"
                      >
                        Enter Discussion <ArrowUpRight size={14} />
                      </Link>
                    ) : isFull ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] text-white/30 text-xs font-semibold border border-white/[0.07] cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock size={13} /> Circle Full
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleToggleJoin(circle.id, e)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.12] transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        Join Circle
                      </button>
                    )}

                    {circle.isJoined && (
                      <button
                        onClick={(e) => handleToggleJoin(circle.id, e)}
                        title="Leave Circle"
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-white/50 hover:text-red-400 border border-white/[0.08] transition-colors"
                      >
                        <CheckCircle2 size={15} className="text-[#c3f340]" />
                      </button>
                    )}
                  </div>
                </div>

              </TiltCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
