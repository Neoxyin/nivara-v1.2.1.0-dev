'use client';

import React, { useState } from 'react';
import { ExplainabilityDialog } from './explainability-dialog';
import { 
  GraduationCap, 
  Landmark, 
  HeartPulse, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Calendar,
  Users,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';
import Link from 'next/link';

import { SupportNeedProfileData } from '@/lib/types';

export interface RecommendationItem {
  id: string;
  category: 'Academic' | 'Financial' | 'Well-being';
  title: string;
  description: string;
  why: string;
  supportOption: string;
  actionText: 'Explore' | 'Learn More' | 'Connect' | 'Request Support' | 'View Resources' | 'Explore support' | 'Connect with advisor' | 'View resource' | 'Request appointment' | 'Open Support Space' | 'Explore financial support' | 'Join an available support circle';
  actionHref?: string;
  requiresConsent?: boolean;
  explainability: {
    contributingFactors: string[];
    timeWindow?: string;
    dataUsed: string[];
    dataNotUsed?: string[];
  };
}

export function buildLiveRecommendations(profile?: SupportNeedProfileData): RecommendationItem[] {
  if (!profile) return DEFAULT_RECOMMENDATIONS;

  const recs: RecommendationItem[] = [];

  // Academic 1: Personalized Advisor Pacing
  if (profile.academic.available && profile.academic.explainability) {
    recs.push({
      id: 'rec-acad-1',
      category: 'Academic',
      title: 'Review core module attendance pacing',
      description: 'Your recent attendance in core modules has dipped slightly. Connecting early with an advisor can help you stay balanced.',
      why: profile.academic.signals?.length ? profile.academic.signals.join(' • ') : 'Evaluated from permitted academic records',
      supportOption: 'Academic Advisor / Peer Tutoring',
      actionText: 'Connect with advisor',
      actionHref: '/academics',
      requiresConsent: true,
      explainability: profile.academic.explainability,
    });
  } else {
    recs.push({
      id: 'rec-acad-1',
      category: 'Academic',
      title: 'Review core module attendance pacing',
      description: 'Module guidance and advising resources are open to all students.',
      why: 'General academic guidance resource (Personalization unavailable without data consent)',
      supportOption: 'Academic Advisor / Peer Tutoring',
      actionText: 'Connect with advisor',
      actionHref: '/academics',
      requiresConsent: false,
      explainability: {
        contributingFactors: ['Academic personalization unavailable without data consent'],
        timeWindow: 'General resource',
        dataUsed: ['None (General unpersonalized listing)'],
        dataNotUsed: ['Academic records', 'Course marks', 'Attendance logs'],
      },
    });
  }

  // Academic 2: Study Plan
  recs.push(DEFAULT_RECOMMENDATIONS[1]);

  // Financial 1: Scholarships
  if (profile.financial.available && profile.financial.explainability) {
    recs.push({
      id: 'rec-acad-3',
      category: 'Financial',
      title: 'Explore active scholarship directories',
      description: 'You may want to explore this support option to check active institutional grant and bursary opportunities.',
      why: profile.financial.signals?.length ? profile.financial.signals.join(' • ') : 'Institutional tuition fees recorded as paid',
      supportOption: 'Scholarships & Fee Assistance',
      actionText: 'Explore financial support',
      actionHref: '/financial-support',
      requiresConsent: false,
      explainability: profile.financial.explainability,
    });
  } else {
    recs.push({
      id: 'rec-acad-3',
      category: 'Financial',
      title: 'Explore active scholarship directories',
      description: 'You may want to explore this support option to check active institutional grant and bursary opportunities.',
      why: 'General institutional bursary and flexible payment options (Personalization unavailable without consent)',
      supportOption: 'Scholarships & Fee Assistance',
      actionText: 'Explore financial support',
      actionHref: '/financial-support',
      requiresConsent: false,
      explainability: {
        contributingFactors: ['Financial personalization unavailable without data consent'],
        timeWindow: 'General resource directory',
        dataUsed: ['None (General unpersonalized directory)'],
        dataNotUsed: [
          'Income',
          'Family income',
          'Expenses',
          'Expense categories',
          'Bank statements',
          'Transaction history',
          'Credit score',
          'Aadhaar',
          'Debt',
          'Financial stress',
        ],
      },
    });
  }

  // Financial 2: Installment Plans
  recs.push(DEFAULT_RECOMMENDATIONS[3]);

  // Well-being 1: AI Support Space
  recs.push(DEFAULT_RECOMMENDATIONS[4]);

  // Well-being 2: Counsellor Slot / Support Circles
  if (profile.wellbeing.available && profile.wellbeing.explainability) {
    recs.push({
      id: 'rec-acad-6',
      category: 'Well-being',
      title: 'Connect with a campus counsellor slot or join a circle',
      description: 'Talking early is a practical, supportive step when managing sustained academic stress.',
      why: profile.wellbeing.signals?.length ? profile.wellbeing.signals.join(' • ') : 'Evaluated from eligible voluntary check-in',
      supportOption: 'Counsellor / Support Circles',
      actionText: 'Join an available support circle',
      actionHref: '/counsellors',
      requiresConsent: true,
      explainability: profile.wellbeing.explainability,
    });
  } else {
    recs.push({
      id: 'rec-acad-6',
      category: 'Well-being',
      title: 'Connect with a campus counsellor slot or join a circle',
      description: 'Confidential support and counselling sessions are available to all students.',
      why: 'General well-being support (Personalization unavailable without consent / eligible check-in)',
      supportOption: 'Counsellor / Support Circles',
      actionText: 'Join an available support circle',
      actionHref: '/counsellors',
      requiresConsent: false,
      explainability: {
        contributingFactors: ['Well-being personalization unavailable without consent / eligible check-in'],
        timeWindow: 'General support directory',
        dataUsed: ['None (General unpersonalized listing)'],
        dataNotUsed: [
          'Voluntary check-in signals',
          'Private reflection notes',
          'Medical / clinical records',
          'Counselling notes',
        ],
      },
    });
  }

  return recs;
}

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  // Academic
  {
    id: 'rec-acad-1',
    category: 'Academic',
    title: 'Review core module attendance pacing',
    description: 'Your recent attendance in core modules has dipped slightly. Connecting early with an advisor can help you stay balanced.',
    why: 'Attendance below 75% in core module sessions over the last 14 days',
    supportOption: 'Academic Advisor / Peer Tutoring',
    actionText: 'Connect with advisor',
    actionHref: '/academics',
    requiresConsent: true,
    explainability: {
      contributingFactors: [
        'Attendance recorded below 75% threshold in 2 core modules.',
        'Consecutive missed tutorials over the past two weeks.'
      ],
      timeWindow: 'Last 14 days',
      dataUsed: ['Module attendance logs', 'Coursework records'],
      dataNotUsed: ['Library swipe data', 'Campus Wi-Fi logs']
    }
  },
  {
    id: 'rec-acad-2',
    category: 'Academic',
    title: 'Prepare a 45-minute prototype study plan',
    description: 'Break upcoming high-effort submissions into smaller, manageable milestones to maintain steady progression.',
    why: 'Upcoming high-effort assignment submission within 18 hours',
    supportOption: 'Study Resources & Time Management Tools',
    actionText: 'View resource',
    actionHref: '/resources',
    requiresConsent: false,
    explainability: {
      contributingFactors: [
        'An upcoming assignment is tagged as high-effort.',
        'Due date is within the next 24 hours.'
      ],
      timeWindow: 'Next 24 hours',
      dataUsed: ['Assignment schedule'],
      dataNotUsed: ['Gradebook performance']
    }
  },

  // Financial
  {
    id: 'rec-acad-3',
    category: 'Financial',
    title: 'Explore active scholarship directories',
    description: 'You may want to explore this support option to check active institutional grant and bursary opportunities.',
    why: 'Profile attributes matched with 2 new bursaries and upcoming deadlines',
    supportOption: 'Scholarships & Fee Assistance',
    actionText: 'Explore financial support',
    actionHref: '/financial-support',
    requiresConsent: false,
    explainability: {
      contributingFactors: [
        'Profile matched with 2 open institutional bursary listings.',
        'Application deadlines approaching within 7 days.'
      ],
      timeWindow: 'Current semester',
      dataUsed: ['Student profile demographics', 'Financial Aid directory'],
      dataNotUsed: ['Bank statements', 'Parental income records']
    }
  },
  {
    id: 'rec-acad-4',
    category: 'Financial',
    title: 'Review flexible payment plan options',
    description: 'You may want to explore this support option for installment guidance and semester planning assistance.',
    why: 'Upcoming tuition installment milestone',
    supportOption: 'Installment Guidance',
    actionText: 'Learn More',
    actionHref: '/financial-support',
    requiresConsent: false,
    explainability: {
      contributingFactors: [
        'Upcoming payment milestone in current term calendar.'
      ],
      timeWindow: 'Current term',
      dataUsed: ['Fee schedule'],
      dataNotUsed: ['Personal savings or external accounts']
    }
  },

  // Well-being
  {
    id: 'rec-acad-5',
    category: 'Well-being',
    title: 'Protect a real lunch break and rest interval',
    description: 'A short reset can help your afternoon focus feel more sustainable and manageable.',
    why: 'Lower reported energy levels across recent voluntary daily check-ins',
    supportOption: 'AI Support Space & Well-being Guides',
    actionText: 'Open Support Space',
    actionHref: '/support',
    requiresConsent: false,
    explainability: {
      contributingFactors: [
        'Reported energy has trended lower over the last 3 check-ins.',
        'Weekly pattern shows busy back-to-back study blocks.'
      ],
      timeWindow: 'Last 7 days',
      dataUsed: ['Voluntary well-being check-ins', 'Coursework schedule'],
      dataNotUsed: ['Academic grades', 'Health center records']
    }
  },
  {
    id: 'rec-acad-6',
    category: 'Well-being',
    title: 'Connect with a campus counsellor slot or join a circle',
    description: 'Talking early is a practical, supportive step when managing sustained academic stress.',
    why: 'Elevated 3-day stress trajectory reported in well-being check-ins',
    supportOption: 'Counsellor / Support Circles',
    actionText: 'Join an available support circle',
    actionHref: '/counsellors',
    requiresConsent: true,
    explainability: {
      contributingFactors: [
        'Self-reported stress levels elevated across check-ins.',
        'Sustained over a 3-day trajectory.'
      ],
      timeWindow: 'Last 3 days',
      dataUsed: ['Voluntary well-being check-ins'],
      dataNotUsed: ['Module attendance', 'Grades']
    }
  }
];

interface SupportRecommendationsProps {
  recommendations?: RecommendationItem[];
  supportNeeds?: SupportNeedProfileData;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function SupportRecommendations({ 
  recommendations,
  supportNeeds,
  isLoading = false, 
  error = null,
  className = '' 
}: SupportRecommendationsProps) {
  const activeRecommendations = recommendations ?? (supportNeeds ? buildLiveRecommendations(supportNeeds) : DEFAULT_RECOMMENDATIONS);
  const [activeTab, setActiveTab] = useState<'All' | 'Academic' | 'Financial' | 'Well-being'>('All');
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});
  const [pendingActionRec, setPendingActionRec] = useState<RecommendationItem | null>(null);

  const handleInitiateAction = (rec: RecommendationItem) => {
    if (rec.requiresConsent) {
      setPendingActionRec(rec);
    } else {
      setActionStates(prev => ({ ...prev, [rec.id]: true }));
    }
  };

  const handleConfirmAction = () => {
    if (pendingActionRec) {
      setActionStates(prev => ({ ...prev, [pendingActionRec.id]: true }));
      setPendingActionRec(null);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-8 w-48 bg-white/10 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/[0.03] border border-white/[0.06] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border border-rose-500/20 bg-rose-500/10 p-6 rounded-xl text-center ${className}`}>
        <p className="text-sm font-semibold text-rose-300">Unable to load recommendations</p>
        <p className="text-xs text-rose-300/70 mt-1">{error}</p>
      </div>
    );
  }

  const filtered = activeTab === 'All' 
    ? activeRecommendations 
    : activeRecommendations.filter(r => r.category === activeTab);

  const academicRecs = filtered.filter(r => r.category === 'Academic');
  const financialRecs = filtered.filter(r => r.category === 'Financial');
  const wellbeingRecs = filtered.filter(r => r.category === 'Well-being');

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#c3f340]" />
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Personalized Guidance & Student Choice</span>
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Support Recommendations</h2>
          <p className="text-sm text-white/60 mt-1">
            Student agency focused. Actions never auto-enroll or book appointments without your explicit confirmation.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.06]">
          {(['All', 'Academic', 'Financial', 'Well-being'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === tab
                  ? 'bg-[#c3f340] text-[#0d1408] font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="border border-white/[0.08] bg-[#141414] p-12 rounded-xl text-center">
          <Sparkles size={32} className="mx-auto text-white/30 mb-3" />
          <h3 className="text-base font-semibold text-white">No active recommendations in this view</h3>
          <p className="text-xs text-white/50 mt-1">You are tracking well or no factors require attention right now.</p>
        </div>
      )}

      {/* Logical Grouping: Academic Support */}
      {(activeTab === 'All' || activeTab === 'Academic') && academicRecs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
            <GraduationCap size={18} />
            <span>Academic Support</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicRecs.map(rec => renderCard(rec, actionStates[rec.id], handleInitiateAction))}
          </div>
        </div>
      )}

      {/* Logical Grouping: Financial Support */}
      {(activeTab === 'All' || activeTab === 'Financial') && financialRecs.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Landmark size={18} />
            <span>Financial Support</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialRecs.map(rec => renderCard(rec, actionStates[rec.id], handleInitiateAction))}
          </div>
        </div>
      )}

      {/* Logical Grouping: Well-being Support */}
      {(activeTab === 'All' || activeTab === 'Well-being') && wellbeingRecs.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
            <HeartPulse size={18} />
            <span>Well-being Support</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellbeingRecs.map(rec => renderCard(rec, actionStates[rec.id], handleInitiateAction))}
          </div>
        </div>
      )}

      {/* Consent & Confirmation Modal */}
      {pendingActionRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/[0.15] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[#c3f340]" />
                <h3 className="text-base font-semibold text-white">Student Consent & Choice Confirmation</h3>
              </div>
              <button 
                onClick={() => setPendingActionRec(null)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <p>
                You are about to initiate: <strong className="text-white">{pendingActionRec.title}</strong>
              </p>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 space-y-2">
                <p className="font-semibold text-white/90">What happens next:</p>
                <ul className="list-disc list-inside space-y-1 text-white/60">
                  <li>This action is entirely student-initiated. No automated booking or enrollment occurs.</li>
                  <li>No additional permissions or data sharing are triggered without your explicit final agreement.</li>
                  <li>You remain in complete control of your progression and support pathway.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setPendingActionRec(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c3f340] hover:bg-[#b0dc35] text-[#0d1408] text-xs font-semibold shadow-sm transition-colors"
              >
                <Check size={14} />
                <span>Confirm & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderCard(
  rec: RecommendationItem, 
  isActioned: boolean | undefined, 
  onInitiateAction: (rec: RecommendationItem) => void
) {
  const isFinancial = rec.category === 'Financial';

  return (
    <div 
      key={rec.id}
      className="flex flex-col justify-between border border-white/[0.08] bg-[#141414] p-5 rounded-xl hover:border-white/[0.18] transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
            rec.category === 'Academic' 
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : rec.category === 'Financial'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
          }`}>
            {rec.category} Support
          </span>

          <ExplainabilityDialog 
            title={rec.title}
            contributingFactors={rec.explainability.contributingFactors}
            timeWindow={rec.explainability.timeWindow}
            dataUsed={rec.explainability.dataUsed}
            dataNotUsed={rec.explainability.dataNotUsed}
            trigger={
              <button className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-white transition-colors">
                <HelpCircle size={12} />
                <span>Why?</span>
              </button>
            }
          />
        </div>

        <h3 className="text-base font-semibold text-white tracking-tight mb-2">
          {rec.title}
        </h3>

        <p className="text-xs text-white/60 leading-relaxed mb-3">
          {rec.description}
        </p>

        {/* Why it was recommended */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded p-2.5 mb-4">
          <span className="text-[9px] uppercase tracking-wider text-[#c3f340]/80 font-mono block mb-0.5">Why recommended</span>
          <p className="text-[11px] text-white/70 leading-snug">{rec.why}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.05] space-y-2">
        <div className="text-[11px] text-white/50 flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#c3f340]" />
          <span>Option: <strong className="text-white/80">{rec.supportOption}</strong></span>
        </div>

        {isActioned ? (
          <div className="bg-[#c3f340]/10 border border-[#c3f340]/30 rounded p-2.5 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#c3f340] font-semibold">
              <CheckCircle2 size={14} />
              <span>Action initiated by you</span>
            </div>
            <p className="text-[10px] text-white/60">
              {isFinancial ? 'Explore this option further at your own pace.' : 'Support pathway unlocked. No automated booking occurred.'}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {rec.actionHref ? (
              <Link
                href={rec.actionHref}
                onClick={(e) => {
                  e.preventDefault();
                  onInitiateAction(rec);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition-colors group"
              >
                <span>{rec.actionText}</span>
                <ArrowRight size={13} className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <button
                onClick={() => onInitiateAction(rec)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition-colors group"
              >
                <span>{rec.actionText}</span>
                <ArrowRight size={13} className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

