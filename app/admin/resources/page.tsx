'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ResourceEditor } from '@/components/admin/resources/resource-editor';
import { resources } from '@/lib/data/admin';

export default function AdminResourcesPage() {
  return (
    <AdminShell
      title="Resource Directory"
      subtitle="Publish, curate, and audit verified emergency, academic, and wellness support toolkits."
    >
      <ResourceEditor resources={resources} />
    </AdminShell>
  );
}
