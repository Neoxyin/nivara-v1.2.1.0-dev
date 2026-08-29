'use client';

import React from 'react';
import { SystemServiceHealth, SystemStatus } from '@/lib/types/admin';
import { TiltCard } from '@/components/ui/tilt-card';
import { Server, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { Pill } from '@/components/shared/pill';

interface SystemHealthCardProps {
  services: SystemServiceHealth[];
}

export function SystemHealthCard({ services }: SystemHealthCardProps) {
  const getStatusBadge = (status: SystemStatus) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400">
            <AlertTriangle size={13} className="text-amber-400" />
            Degraded
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-rose-400">
            <XCircle size={13} className="text-rose-400" />
            Offline
          </span>
        );
    }
  };

  return (
    <TiltCard
      maxTilt={1}
      className="rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-6 backdrop-blur-xl h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#c3f340]/10 text-[#c3f340]">
              <Server size={16} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">System Health</h3>
              <p className="text-xs text-white/50">Infrastructure & platform integrity</p>
            </div>
          </div>
          <Pill tone="accent">All Systems Normal</Pill>
        </div>

        <div className="space-y-2.5 mt-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.05] px-3.5 py-3 text-xs"
            >
              <div className="space-y-0.5">
                <p className="font-medium text-white/90">{service.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                  {service.latencyMs && <span>{service.latencyMs}ms latency</span>}
                  {service.uptimePercentage && (
                    <>
                      <span>·</span>
                      <span>{service.uptimePercentage}% uptime</span>
                    </>
                  )}
                </div>
              </div>
              <div>{getStatusBadge(service.status)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-[#c3f340]" />
          Zero-Knowledge Layer: Active
        </span>
        <span>Telemetry Refresh: 10s</span>
      </div>
    </TiltCard>
  );
}
