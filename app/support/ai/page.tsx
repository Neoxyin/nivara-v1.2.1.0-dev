import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { AiChatInterface } from '@/components/support/ai-chat-interface';
import { ContextualSubtabs } from '@/components/shared/contextual-subtabs';

const supportSubtabs = [
  { labelKey: 'subtab.overview', defaultLabel: 'Overview', href: '/support', exact: true },
  { labelKey: 'subtab.ai_support', defaultLabel: 'AI Support Space', href: '/support/ai' },
];

export default function AiSupportPage() {
  return (
    <AppShell>
      <div className="rise-in space-y-8">
        <ContextualSubtabs items={supportSubtabs} />
        <SectionHeading
          eyebrow="Interactive Support Space"
          title="AI Support Navigator"
          description="A secure, interactive space to explore campus resources, talk through pacing strategies, and connect with counsellors."
        />

        <AiChatInterface />
      </div>
    </AppShell>
  );
}
