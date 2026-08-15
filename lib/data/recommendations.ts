import type { Recommendation } from '../types';

export const mockRecommendations: Recommendation[] = [
  { 
    title: 'Make a 45-minute prototype plan', 
    description: 'Turn tomorrow\'s walkthrough into three small moves.', 
    type: 'Study plan', 
    completed: false,
    why: 'Upcoming high-effort submission in 18h'
  },
  { 
    title: 'Protect a real lunch break', 
    description: 'A short reset can make your afternoon more usable.', 
    type: 'Well-being', 
    completed: true,
    why: 'Lower reported energy in recent check-ins'
  },
  { 
    title: 'Save a counsellor slot', 
    description: 'Talking early is a practical study-support move.', 
    type: 'Support', 
    completed: false,
    why: 'Elevated 3-day stress trajectory'
  },
];