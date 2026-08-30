'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ConsentLogTable } from '@/components/admin/consent-audit/consent-log-table';
import { consentAuditLogs } from '@/lib/data/admin';

export default function AdminConsentAuditPage() {
  return (
    <AdminShell
      title="Consent & Privacy Audit"
      subtitle="Immutable institutional audit ledger of all student consent grants, category permissions, and revocation events."
    >
      <ConsentLogTable logs={consentAuditLogs} />
    </AdminShell>
  );
}
