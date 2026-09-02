'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Globe2 } from 'lucide-react';
import { Mark } from '@/components/shared/mark';

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    heading: 'For Institutions',
    links: [
      { label: 'About Nivara', href: '/about' },
      { label: 'Book a Demo', href: '/about' },
      { label: 'Contact Us', href: '/about' },
      { label: 'FAQ', href: '/about' },
    ],
  },
  {
    heading: 'For Students',
    links: [
      { label: 'Sign Up', href: '/' },
      { label: 'Counsellors', href: '/counsellors' },
      { label: 'Support Resources', href: '/resources' },
      { label: 'Financial Support', href: '/financial-support' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Consent & Data Governance', href: '/privacy' },
      { label: 'Accessibility', href: '/about' },
      { label: 'Compliance', href: '/privacy' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="max-w-xs">
            <Mark inverse href="/" />
            <p className="mt-4 text-xs leading-5 text-white/45">
              A private, explainable wellbeing companion for students — built on academic rhythm, energy,
              and confidential check-ins.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c3f340] shadow-[0_0_10px_rgba(195,243,64,.7)]" />
              <span>Confidential by Design</span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/70">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/45 transition-colors hover:text-[#c3f340]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get the app / access */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/70">Get Nivara</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2.5 text-[11px] font-semibold text-white/70">
                <Smartphone size={14} className="text-[#c3f340]" />
                <span>Mobile app · coming soon</span>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-[#c3f340]/40 hover:text-[#dff77d]"
              >
                <Globe2 size={14} className="text-[#c3f340]" />
                <span>Get started on Web</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-[10px] uppercase tracking-[.12em] text-white/35 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Nivara · Academic, Financial, and Well-being Student Support</span>
          <span>Zero Algorithmic Surveillance · FERPA & GDPR Compliant</span>
        </div>
      </div>
    </footer>
  );
}
