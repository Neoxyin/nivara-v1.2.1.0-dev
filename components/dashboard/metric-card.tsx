'use client';
import { ReactNode } from 'react';
interface MetricCardProps { label:string; value:string; detail:string; tone?:'neutral'|'accent'|'warm'; icon?:ReactNode; }
export function MetricCard({label,value,detail,tone='neutral',icon}:MetricCardProps){
 const toneClass=tone==='accent'?'bg-[#c3f340]/[.07] border-[#c3f340]/20':tone==='warm'?'bg-[#e5a27d]/[.06] border-[#e5a27d]/20':'glass-card';
 return <article className={`min-h-[148px] border p-5 ${toneClass}`} data-testid={`card-metric-${label.toLowerCase().replaceAll(' ','-')}`}><div className="flex items-start justify-between"><p className="serenity-label">{label}</p>{icon&&<span className="text-white/45">{icon}</span>}</div><p className="mt-5 font-display text-[2.55rem] leading-none tracking-tight">{value}</p><p className="mt-3 text-xs text-white/45">{detail}</p></article>
}
