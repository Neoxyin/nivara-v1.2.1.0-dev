import { AppShell } from '@/components/layout/nivara-shell';
import { SupportCircleDetail } from '@/components/support/support-circles-detail';

export default async function SupportCircleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppShell>
      <div className="rise-in">
        <SupportCircleDetail circleId={id} />
      </div>
    </AppShell>
  );
}
