import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { SupportCirclesList } from '@/components/support/support-circles-list';
export default function SupportCirclesPage() {
  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <SectionHeading
          eyebrow="Temporary Peer Support"
          title="Temporary Support Circles"
          description="Purpose-specific, membership-limited, moderated circles designed for short-term mutual encouragement and shared reflection."
        />

        <SupportCirclesList />
      </div>
    </AppShell>
  );
}
