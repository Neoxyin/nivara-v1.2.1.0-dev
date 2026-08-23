import { AppShell } from '@/components/layout/nivara-shell';
import { SupportCircleDetail } from '@/components/support/support-circles-detail';

export default function SupportCircleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <AppShell>
      <div className="rise-in">
        <SupportCircleDetail circleId={id} />
      </div>
    </AppShell>
  );
}
