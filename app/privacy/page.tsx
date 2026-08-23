import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { PrivacyHub } from '@/components/privacy/privacy-hub';
import { ContextualSubtabs } from '@/components/shared/contextual-subtabs';
import { profileSubtabs } from '@/components/shared/profile-subtabs';

export default function DataPrivacyPage() {
  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <ContextualSubtabs items={profileSubtabs} />
        <SectionHeading
          eyebrow="Privacy Dashboard & Rights"
          title="Privacy & Data Transparency"
          description="Understand what data Nivara holds, manage your PRD consent categories, inspect data sources, and submit accuracy correction requests securely."
        />

        <PrivacyHub />
      </div>
    </AppShell>
  );
}

