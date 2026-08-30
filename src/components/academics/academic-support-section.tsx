'use client';

import { useQuery } from '@tanstack/react-query';
import { getAcademicSupportOptions } from '@/lib/api/academic-support';
import { TiltCard } from '@/components/ui/tilt-card';
import { Pill } from '@/components/shared/pill';
import { StaggerContainer } from '@/components/ui/stagger-container';
import { Magnetic } from '@/components/ui/magnetic';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  UserCheck, 
  GraduationCap, 
  Users, 
  LayoutGrid, 
  BookOpen, 
  FileText, 
  Edit3, 
  Clock, 
  Briefcase 
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'user-check': <UserCheck size={18} className="text-[#c3f340]" />,
  'graduation-cap': <GraduationCap size={18} className="text-[#c3f340]" />,
  'users': <Users size={18} className="text-[#c3f340]" />,
  'layout-grid': <LayoutGrid size={18} className="text-[#c3f340]" />,
  'book-open': <BookOpen size={18} className="text-[#c3f340]" />,
  'file-text': <FileText size={18} className="text-[#c3f340]" />,
  'edit-3': <Edit3 size={18} className="text-[#c3f340]" />,
  'clock': <Clock size={18} className="text-[#c3f340]" />,
  'briefcase': <Briefcase size={18} className="text-[#c3f340]" />,
};

export function AcademicSupportSection() {
  const { data: options, isLoading, error } = useQuery({ 
    queryKey: ['academicSupport'], 
    queryFn: getAcademicSupportOptions 
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c3f340]" />
      </div>
    );
  }

  if (error || !options || options.length === 0) {
    return (
      <div className="text-center text-white/50 p-8 border border-white/[0.05] rounded-xl bg-white/[0.02]">
        <p>Support options are currently unavailable. Please check back later.</p>
      </div>
    );
  }

  const categories = Array.from(new Set(options.map(o => o.category)));

  return (
    <div className="space-y-8 mt-16 pt-8 border-t border-white/[0.05]">
      <div>
        <h2 className="font-display text-2xl text-white">Institutional Academic Support</h2>
        <p className="mt-2 text-sm text-white/60 max-w-2xl leading-relaxed">
          NIVARA connects you directly to available institutional support. You have full agency over whether to use these services. Using support will never penalize your standing or restrict your benefits.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => {
          const categoryOptions = options.filter(o => o.category === category);
          
          return (
            <div key={category}>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-semibold text-lg text-white/90">{category}</h3>
                <span className="h-px flex-1 bg-white/[0.05]" />
              </div>

              <StaggerContainer stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryOptions.map((option) => (
                  <div key={option.id} className="stagger-item">
                    <TiltCard
                      maxTilt={2}
                      className="h-full flex flex-col border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl transition-all hover:border-white/20 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          {iconMap[option.iconType] || <BookOpen size={18} className="text-[#c3f340]" />}
                        </div>
                        <h4 className="font-semibold text-white">{option.title}</h4>
                      </div>
                      
                      <div className="flex-1 space-y-3 text-sm">
                        <p className="text-white/70">{option.shortDescription}</p>
                        <div className="p-3 bg-white/[0.02] rounded border border-white/[0.04] text-white/50 text-xs leading-relaxed">
                          <strong className="text-white/70 font-medium">Purpose:</strong> {option.purpose}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/[0.06]">
                        <Magnetic>
                          <Link
                            href={option.actionHref}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em] text-[#c3f340] hover:text-[#dff77d] transition-colors"
                          >
                            {option.actionText} <ArrowUpRight size={13} />
                          </Link>
                        </Magnetic>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
