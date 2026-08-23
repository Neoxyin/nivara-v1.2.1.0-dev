import type { SubtabItem } from './contextual-subtabs';

export const profileSubtabs: SubtabItem[] = [
  { labelKey: 'subtab.my_profile', defaultLabel: 'My Profile', href: '/profile', exact: true },
  { labelKey: 'subtab.data_privacy', defaultLabel: 'Data & Privacy', href: '/privacy', exact: true },
  { labelKey: 'subtab.settings', defaultLabel: 'Settings', href: '/settings', exact: true },
];
