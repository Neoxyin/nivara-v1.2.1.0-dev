'use client';
import { ReactNode } from 'react';
interface PillProps { children: ReactNode; tone?: 'default'|'accent'|'warm'|'plum'; className?: string; }
export function Pill({children,tone='default',className=''}:PillProps){
 const tones={default:'bg-white/[.06] text-white/55 border border-white/[.08]',accent:'bg-[#c3f340]/[.12] text-[#dff77d] border border-[#c3f340]/20',warm:'bg-[#e5a27d]/[.10] text-[#f0ba9d] border border-[#e5a27d]/20',plum:'bg-[#9b7cc7]/[.12] text-[#c9b8df] border border-[#9b7cc7]/20'};
 return <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[.08em] ${tones[tone]} ${className}`}>{children}</span>
}
