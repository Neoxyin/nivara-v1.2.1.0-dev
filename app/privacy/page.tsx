import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { PrivacyHub } from '@/components/privacy/privacy-hub';

export default function DataPrivacyPage() {
  return (
    <AppShell>
      <div className="rise-in space-y-8">
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

