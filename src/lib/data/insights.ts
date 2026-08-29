import type { Insight } from '../types';

export const mockInsights: Insight[] = [
  { 
    title: 'Your workload is concentrating', 
    summary: 'Two high-effort submissions land within the next 48 hours. Your check-ins also show lower sleep and energy this week.', 
    contributingFactors: ['2 deadlines in 48 hours', 'Sleep rated 2 / 5 twice', 'Creative coding workload at 82%'], 
    certainty: 'High confidence · based on 3 recent signals', 
    tone: 'watch', 
    actions: ['Build a 45-minute prototype plan', 'Move one low-priority task to Friday'] 
  },
  { 
    title: 'Research is a reliable anchor', 
    summary: 'Your strongest marks and most consistent attendance are in Design research. It may be a useful place to borrow momentum from.', 
    contributingFactors: ['84% latest score', '97% attendance', 'Steady workload'], 
    certainty: 'Good confidence · based on academic data', 
    tone: 'positive', 
    actions: ['Use your fieldwork notes as a starting point'] 
  },
];