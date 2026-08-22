import type { Recommendation } from '../types';

export const mockRecommendations: Recommendation[] = [
  { 
    title: 'Make a 45-minute prototype plan', 
    description: 'Turn tomorrow\'s walkthrough into three small moves.', 
    type: 'Study plan', 
    completed: false,
    why: 'Upcoming high-effort submission in 18h',
    explainability: {
      contributingFactors: [
        'An upcoming assignment is tagged as high-effort.',
        'Due within 18 hours.'
      ],
      timeWindow: 'Next 24 hours',
      dataUsed: ['Assignment schedule'],
      dataNotUsed: ['Gradebook performance']
    }
  },
  { 
    title: 'Protect a real lunch break', 
    description: 'A short reset can make your afternoon more usable.', 
    type: 'Well-being', 
    completed: true,
    why: 'Lower reported energy in recent check-ins',
    explainability: {
      contributingFactors: [
        'Reported energy has trended lower over the last 3 check-ins.',
        'Your timetable shows back-to-back afternoon classes.'
      ],
      timeWindow: 'Last 7 days',
      dataUsed: ['Well-being check-ins', 'Class timetable'],
      dataNotUsed: ['Academic grades']
    }
  },
  { 
    title: 'Save a counsellor slot', 
    description: 'Talking early is a practical study-support move.', 
    type: 'Support', 
    completed: false,
    why: 'Elevated 3-day stress trajectory',
    explainability: {
      contributingFactors: [
        'Self-reported stress levels have been elevated.',
        'Sustained over a 3-day trajectory.'
      ],
      timeWindow: 'Last 3 days',
      dataUsed: ['Well-being check-ins'],
      dataNotUsed: ['Module attendance', 'Grades']
    }
  },
];
