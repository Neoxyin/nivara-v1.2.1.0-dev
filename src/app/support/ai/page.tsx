import { AppShell } from '@/components/layout/nivara-shell';
import { SectionHeading } from '@/components/shared/section-heading';
import { AiChatInterface } from '@/components/support/ai-chat-interface';
export default function AiSupportPage() {
  return (
    <AppShell>
      <div className="rise-in space-y-8">
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
