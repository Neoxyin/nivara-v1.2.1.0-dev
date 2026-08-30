'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Landmark, 
  HeartPulse, 
  BookOpen, 
  Compass, 
  Users, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface SupportOption {
  id: string;
  title: string;
  description: string;
  dimension: 'Academic' | 'Financial' | 'Well-being';
  category: string;
  actionLabel?: string;
  actionUrl?: string;
}

const SUPPORT_OPTIONS: SupportOption[] = [
  // Academic
  {
    id: 'acad-1',
    title: 'Academic advisor',
    description: 'Connect for personalized academic guidance, module planning, and progression check-ins.',
    dimension: 'Academic',
    category: 'Advising',
    actionLabel: 'Explore advisor schedule'
  },
  {
    id: 'acad-2',
    title: 'Faculty mentor',
    description: 'Discuss module pathways and career-aligned subject choices with faculty experts.',
    dimension: 'Academic',
    category: 'Mentorship',
    actionLabel: 'Explore faculty mentorship'
  },
  {
    id: 'acad-3',
    title: 'Peer tutoring',
    description: 'Get collaborative study support and concept clarification from experienced peers.',
    dimension: 'Academic',
    category: 'Tutoring',
    actionLabel: 'Explore peer tutoring'
  },
  {
    id: 'acad-4',
    title: 'Subject resources',
    description: 'Access curated lecture recordings, summaries, and recommended reading lists.',
    dimension: 'Academic',
    category: 'Resources',
    actionLabel: 'Explore subject resources'
  },
  {
    id: 'acad-5',
    title: 'Study resources',
    description: 'Use structured study planners, templates, and revision guides.',
    dimension: 'Academic',
    category: 'Resources',
    actionLabel: 'Explore study tools'
  },
  {
    id: 'acad-6',
    title: 'Exam preparation',
    description: 'Practice with past papers, mock quizzes, and timed revision sessions.',
    dimension: 'Academic',
    category: 'Preparation',
    actionLabel: 'Explore exam prep'
  },
  {
    id: 'acad-7',
    title: 'Time management',
    description: 'Work with self-paced scheduling frameworks to balance deadlines and rest.',
    dimension: 'Academic',
    category: 'Skills',
    actionLabel: 'Explore time tools'
  },
  {
    id: 'acad-8',
    title: 'Workshops',
    description: 'Join interactive sessions on effective note-taking, assignment structuring, and research.',
    dimension: 'Academic',
    category: 'Workshops',
    actionLabel: 'Explore workshop calendar'
  },
  {
    id: 'acad-9',
    title: 'Placement preparation',
    description: 'Prepare CVs, practice mock interviews, and review internship application guidelines.',
    dimension: 'Academic',
    category: 'Careers',
    actionLabel: 'Explore placement support'
  },

  // Financial
  {
    id: 'fin-1',
    title: 'Scholarships',
    description: 'You may want to explore this support option to check active scholarship opportunities and criteria.',
    dimension: 'Financial',
    category: 'Funding',
    actionLabel: 'Explore scholarships'
  },
  {
    id: 'fin-2',
    title: 'Fee assistance',
    description: 'You may want to explore this support option for flexible payment arrangements and guidance.',
    dimension: 'Financial',
    category: 'Assistance',
    actionLabel: 'Explore fee assistance'
  },
  {
    id: 'fin-3',
    title: 'Installments',
    description: 'You may want to explore this support option to review split payment plans for tuition or fees.',
    dimension: 'Financial',
    category: 'Planning',
    actionLabel: 'Explore installment options'
  },
  {
    id: 'fin-4',
    title: 'Emergency funds',
    description: 'You may want to explore this support option regarding short-term institutional emergency grants.',
    dimension: 'Financial',
    category: 'Emergency',
    actionLabel: 'Explore emergency support'
  },
  {
    id: 'fin-5',
    title: 'Hostel/food assistance',
    description: 'You may want to explore this support option for campus dining credits and accommodation subsidies.',
    dimension: 'Financial',
    category: 'Living',
    actionLabel: 'Explore housing support'
  },
  {
    id: 'fin-6',
    title: 'Transportation support',
    description: 'You may want to explore this support option for transit passes and travel subsidy programs.',
    dimension: 'Financial',
    category: 'Transit',
    actionLabel: 'Explore transport options'
  },
  {
    id: 'fin-7',
    title: 'Books/equipment support',
    description: 'You may want to explore this support option for library textbook vouchers and tech lending.',
    dimension: 'Financial',
    category: 'Supplies',
    actionLabel: 'Explore equipment support'
  },
  {
    id: 'fin-8',
    title: 'Work-study',
    description: 'You may want to explore this support option for campus employment and flexible student roles.',
    dimension: 'Financial',
    category: 'Employment',
    actionLabel: 'Explore work-study'
  },
  {
    id: 'fin-9',
    title: 'Government/institutional schemes',
    description: 'You may want to explore this support option to review external grants and state aid directories.',
    dimension: 'Financial',
    category: 'Schemes',
    actionLabel: 'Explore external schemes'
  },

  // Well-being
  {
    id: 'wb-1',
    title: 'AI Support Space',
    description: 'Work through immediate study stress, draft task priorities, and try guided breathing or grounding exercises.',
    dimension: 'Well-being',
    category: 'Digital',
    actionLabel: 'Open AI Support Space'
  },
  {
    id: 'wb-2',
    title: 'Counsellor',
    description: 'Connect confidentially with professional mental health practitioners on campus.',
    dimension: 'Well-being',
    category: 'Professional',
    actionLabel: 'Explore counselling slots'
  },
  {
    id: 'wb-3',
    title: 'Support resources',
    description: 'Browse campus-vetted sleep hygiene guides, somatic grounding audios, and exam stress protocols.',
    dimension: 'Well-being',
    category: 'Self-care',
    actionLabel: 'Explore well-being guides'
  },
  {
    id: 'wb-4',
    title: 'Support circles',
    description: 'Participate in peer support groups centered on shared experiences and wellness practices.',
    dimension: 'Well-being',
    category: 'Community',
    actionLabel: 'Explore support circles'
  },
  {
    id: 'wb-5',
    title: 'Follow-up support',
    description: 'Schedule an informal 15-minute sync with student services to review ongoing academic accommodations or campus resources.',
    dimension: 'Well-being',
    category: 'Coordination',
    actionLabel: 'Explore follow-up options'
  }
];

interface SupportMatchingProps {
  initialDimension?: 'All' | 'Academic' | 'Financial' | 'Well-being';
  className?: string;
}

export function SupportMatching({ initialDimension = 'All', className = '' }: SupportMatchingProps) {
  const [selectedDimension, setSelectedDimension] = useState<'All' | 'Academic' | 'Financial' | 'Well-being'>(initialDimension);
  const [exploringId, setExploringId] = useState<string | null>(null);

  const filteredOptions = selectedDimension === 'All' 
    ? SUPPORT_OPTIONS 
    : SUPPORT_OPTIONS.filter(opt => opt.dimension === selectedDimension);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Intro */}
      <div className="border border-white/[0.08] bg-[#141414] p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#c3f340]" />
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Available Support Explorer</span>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Explore Support Options</h2>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Support is entirely optional. You may want to explore these available resources whenever you feel they could be helpful. You remain in complete control of your choices.
            </p>
          </div>
          
          {/* Dimension Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.06]">
            {(['All', 'Academic', 'Financial', 'Well-being'] as const).map((dim) => (
              <button
                key={dim}
                onClick={() => setSelectedDimension(dim)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedDimension === dim
                    ? 'bg-[#c3f340] text-[#0d1408] font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOptions.map((option) => {
          const isFinancial = option.dimension === 'Financial';
          const isExploring = exploringId === option.id;

          return (
            <div 
              key={option.id}
              className="flex flex-col justify-between border border-white/[0.08] bg-[#141414]/80 p-5 rounded-xl hover:border-white/[0.18] transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                    option.dimension === 'Academic' 
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : option.dimension === 'Financial'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {option.dimension} • {option.category}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                  {option.title}
                </h3>
                
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {option.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.05]">
                {isExploring ? (
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#c3f340] font-medium mb-1">
                      <CheckCircle2 size={14} />
                      <span>Exploration initiated</span>
                    </div>
                    <p className="text-[11px] text-white/50">
                      {isFinancial 
                        ? 'You may want to explore this support option further with an advisor.' 
                        : 'Explore this option at your own pace.'}
                    </p>
                    <button 
                      onClick={() => setExploringId(null)}
                      className="mt-2 text-[10px] text-white/40 hover:text-white underline"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setExploringId(option.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-white transition-colors group"
                  >
                    <span>{option.actionLabel || 'Explore this option'}</span>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-punitive footer note */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-[#c3f340] shrink-0 mt-0.5" />
        <div className="text-xs text-white/60 space-y-1">
          <p className="font-semibold text-white/80">Support Availability & Student Agency</p>
          <p>
            All support options are optional and intended to assist you. Exploring or using support does not affect your grades, benefits, attendance penalties, discipline, or institutional eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
