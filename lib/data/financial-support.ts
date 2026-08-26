import type { FinancialSupportOption } from '../types';

export const mockFinancialSupportOptions: FinancialSupportOption[] = [
  {
    id: 'scholarships',
    type: 'Scholarships',
    shortExplanation: 'Merit and need-based institutional grants that do not require repayment.',
    whyItMayHelp: 'Reduces overall tuition burden for the academic year.',
    actionText: 'Explore Scholarships',
    actionHref: '/resources',
    iconType: 'graduation-cap'
  },
  {
    id: 'fee-assistance',
    type: 'Fee Assistance',
    shortExplanation: 'Partial or full waivers for specific administrative or lab fees.',
    whyItMayHelp: 'Lowers immediate out-of-pocket costs at the start of the semester.',
    actionText: 'View Fee Assistance',
    actionHref: '/resources',
    iconType: 'receipt'
  },
  {
    id: 'installments',
    type: 'Installments',
    shortExplanation: 'Payment plans allowing you to spread tuition costs over several months.',
    whyItMayHelp: 'Provides predictable cash flow instead of a single large payment.',
    actionText: 'Set Up Payment Plan',
    actionHref: '/resources',
    iconType: 'calendar'
  },
  {
    id: 'emergency-funds',
    type: 'Emergency Funds',
    shortExplanation: 'Rapid, short-term financial assistance for unexpected life events.',
    whyItMayHelp: 'Helps cover immediate crises like medical bills or sudden loss of housing.',
    actionText: 'Apply for Emergency Aid',
    actionHref: '/resources',
    iconType: 'alert-circle'
  },
  {
    id: 'hostel-assistance',
    type: 'Hostel Assistance',
    shortExplanation: 'Subsidies or grants targeted specifically for on-campus or off-campus housing.',
    whyItMayHelp: 'Ensures you have stable accommodation during your studies.',
    actionText: 'Explore Housing Support',
    actionHref: '/resources',
    iconType: 'home'
  },
  {
    id: 'food-assistance',
    type: 'Food Assistance',
    shortExplanation: 'Campus food pantries, meal plan subsidies, and grocery vouchers.',
    whyItMayHelp: 'Alleviates food insecurity so you can focus on academics.',
    actionText: 'Find Food Resources',
    actionHref: '/resources',
    iconType: 'coffee'
  },
  {
    id: 'transportation',
    type: 'Transportation',
    shortExplanation: 'Discounted transit passes and travel grants for commuting students.',
    whyItMayHelp: 'Reduces the daily cost of attending classes and accessing campus resources.',
    actionText: 'View Transit Support',
    actionHref: '/resources',
    iconType: 'bus'
  },
  {
    id: 'books-equipment',
    type: 'Books & Equipment',
    shortExplanation: 'Vouchers or loan programs for essential textbooks, laptops, and materials.',
    whyItMayHelp: 'Ensures you have the necessary tools for coursework without upfront costs.',
    actionText: 'Request Equipment',
    actionHref: '/resources',
    iconType: 'book-open'
  },
  {
    id: 'work-study',
    type: 'Work-study',
    shortExplanation: 'Part-time, on-campus employment designed around your class schedule.',
    whyItMayHelp: 'Provides a steady income stream while building professional experience.',
    actionText: 'Browse Work-study Jobs',
    actionHref: '/resources',
    iconType: 'briefcase'
  },
  {
    id: 'government-schemes',
    type: 'Government/Institutional Schemes',
    shortExplanation: 'External and state-sponsored financial aid programs available to students.',
    whyItMayHelp: 'Offers broader, long-term financial backing based on regional or national criteria.',
    actionText: 'View Government Schemes',
    actionHref: '/resources',
    iconType: 'landmark'
  }
];

export function matchFinancialSupportOptions(feeStatus?: 'PAID' | 'NOT_PAID' | null): FinancialSupportOption[] {
  if (feeStatus === 'NOT_PAID') {
    // Surface existing fee-related scholarship/fee-assistance/installment resources first
    const feeRelatedIds = ['fee-assistance', 'scholarships', 'installments', 'emergency-funds'];
    const prioritized = mockFinancialSupportOptions.filter((opt) => feeRelatedIds.includes(opt.id));
    const others = mockFinancialSupportOptions.filter((opt) => !feeRelatedIds.includes(opt.id));
    return [...prioritized, ...others];
  }
  // When feeStatus is 'PAID' or absent/null, return all existing general options in standard order
  return [...mockFinancialSupportOptions];
}


