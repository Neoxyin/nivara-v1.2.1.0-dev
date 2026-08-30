'use client';

import React from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ResourceEditor } from '@/components/admin/resources/resource-editor';
import { resources } from '@/lib/data/admin';

export default function AdminResourcesPage() {
  return (
    <AdminShell
      title="Resources"
      subtitle="Publish, review, and maintain verified campus directories for emergency aid, academic tutoring, and financial programs."
    >
      <ResourceEditor resources={resources} />
    </AdminShell>
  );
}
