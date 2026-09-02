export interface PrivacyPolicySection {
  id: string;
  title: string;
  body: string[];
  highlight?: boolean;
}

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: 'intro',
    title: '1. What Nivara Collects',
    body: [
      'Nivara collects only what you choose to share: daily check-in ratings (mood, energy, stress, sleep, workload), optional reflections, academic rhythm signals you consent to connect, and basic profile details (name, course, year).',
      'You control each data category independently through granular consent toggles. Nothing is collected outside the categories you have actively turned on.',
    ],
  },
  {
    id: 'use',
    title: '2. How Your Data Is Used',
    body: [
      'Your check-in data powers a deterministic, explainable insight engine that surfaces patterns back to you — never a black-box score. Insights are generated for your own dashboard first and foremost.',
      'Aggregate, de-identified trends may inform institutional wellbeing programs. Individual reflections are never sold, advertised against, or shared with third parties.',
    ],
  },
  {
    id: 'access',
    title: '3. Who Can See Your Individual Data',
    body: [
      'Role-Based Access Control (RBAC) strictly segregates data. Counsellors and academic staff cannot browse student logs by default.',
      'A counsellor only gains access to your detailed check-in history, academic rhythm, and support profile once you have been appointed to them for a consultation. Access outside an active appointment is not possible under normal operation.',
    ],
  },
  {
    id: 'severe-risk',
    title: '4. Severe Risk & Parental Notification',
    body: [
      'If your check-in patterns or a conversation indicate a high or severe support need, Nivara routes this — as a signal, not a diagnosis — to a qualified counsellor for human review. Nivara itself never contacts parents or guardians automatically.',
      'Should a counsellor, after directly consulting with you, form the professional judgement that your safety is at serious risk, they may choose to inform a parent or emergency contact on file as part of their duty of care. This decision is always made by a human counsellor following consultation, never by an automated system.',
    ],
    highlight: true,
  },
  {
    id: 'rights',
    title: '5. Your Rights',
    body: [
      'You may review, export, or request correction of your data at any time from your Privacy & Data Transparency dashboard. You may withdraw consent for any data category, which stops new collection immediately.',
      'Withdrawing consent does not retroactively notify anyone and does not affect any appointment already in progress with a counsellor.',
    ],
  },
  {
    id: 'retention',
    title: '6. Data Retention & Security',
    body: [
      'Check-in and consultation records are retained only as long as necessary to provide support and meet institutional record-keeping obligations, then securely deleted.',
      'All data is encrypted in transit and at rest, and access is logged for audit purposes.',
    ],
  },
];
