'use client';

import { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { Pill } from '@/components/shared/pill';
import { TiltCard } from '@/components/ui/tilt-card';
import { Magnetic } from '@/components/ui/magnetic';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Search, Bookmark } from 'lucide-react';
import { getResources } from '@/lib/api/resources';
import { useQuery } from '@tanstack/react-query';

export default function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);
  const { data: resources } = useQuery({ queryKey: ['resources'], queryFn: getResources });

  const categories = ['All', ...Array.from(new Set(resources?.map((r) => r.category) || []))];
  const filtered = useMemo(
    () =>
      resources?.filter(
        (r) =>
          (category === 'All' || r.category === category) &&
          `${r.title} ${r.description}`.toLowerCase().includes(query.toLowerCase())
      ) || [],
    [query, category, resources]
  );

  const toggleSave = (title: string) =>
    setSaved((s) => (s.includes(title) ? s.filter((x) => x !== title) : [...s, title]));

  return (
    <AppShell>
      <div className="rise-in">
        <SectionHeading
          eyebrow="Resource shelf"
          title="Useful, when you need it."
          description="Short, considered guidance for the moments that make student life harder to navigate."
        />

        {/* Search + filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-white/[0.08] py-3.5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-resource-search"
              placeholder="Search resources..."
              className="w-full border border-white/[0.09] bg-white/[0.02] py-2.5 pl-9 pr-4 text-sm text-white/85 outline-none placeholder:text-white/25 focus:border-[#c3f340]/50 transition-colors duration-150 rounded"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((x) => (
              <Magnetic key={x}>
                <button
                  onClick={() => setCategory(x)}
                  data-testid={`button-resource-category-${x}`}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[.08em] transition-all duration-150 rounded ${
                    category === x
                      ? 'bg-[#c3f340] text-[#0d1408] shadow-[0_0_12px_rgba(195,243,64,0.4)]'
                      : 'border border-white/[0.09] text-white/40 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {x}
                </button>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Resource grid */}
        <StaggerContainer stagger={0.06} className="grid grid-cols-3 gap-3">
          {filtered.map((r, i) => (
            <div key={r.title} className="stagger-item">
              <TiltCard
                maxTilt={4}
                spotlightColor={r.featured ? 'rgba(195,243,64,0.18)' : 'rgba(255,255,255,0.08)'}
                className={`border p-7 backdrop-blur-xl transition-all duration-200 ${
                  r.featured
                    ? 'border-[#c3f340]/30 bg-[#141414]/90 shadow-[0_0_20px_rgba(195,243,64,0.06)]'
                    : 'border-white/[0.09] bg-[hsl(var(--card))]/90'
                }`}
                data-testid={`card-resource-${i}`}
              >
                <div className="flex items-start justify-between">
                  <Pill
                    tone={
                      r.category === 'Well-being'
                        ? 'warm'
                        : r.category === 'Focus'
                        ? 'plum'
                        : 'default'
                    }
                  >
                    {r.category}
                  </Pill>
                  <Magnetic>
                    <button
                      aria-label={saved.includes(r.title) ? `Unsave ${r.title}` : `Save ${r.title}`}
                      data-testid={`button-save-resource-${i}`}
                      onClick={() => toggleSave(r.title)}
                      className={`p-1.5 transition-all duration-150 ${
                        saved.includes(r.title)
                          ? 'text-[#c3f340] scale-110 drop-shadow-[0_0_8px_#c3f340]'
                          : 'text-white/30 hover:text-white/80'
                      }`}
                    >
                      <Bookmark size={16} fill={saved.includes(r.title) ? 'currentColor' : 'none'} />
                    </button>
                  </Magnetic>
                </div>
                <h2 className="mt-10 max-w-xs font-display text-3xl leading-[.95] text-white">
                  {r.title}
                </h2>
                <p className="mt-4 text-xs leading-5 text-white/45">{r.description}</p>
                <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <span className="serenity-label text-white/35">{r.readTime}</span>
                  {r.featured && <Pill tone="accent">Featured</Pill>}
                </div>
              </TiltCard>
            </div>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="serenity-label text-white/30">No resources match</p>
            <p className="mt-3 text-sm text-white/35">
              Try a different search or clear the category filter.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}


