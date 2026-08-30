export interface SupportCircle {
  id: string;
  title: string;
  category: 'First-Year Homesickness' | 'Exam Stress' | 'Placement Anxiety' | 'Hostel Loneliness' | 'Academic Burnout' | 'Relationship Problems';
  description: string;
  moderator: string;
  memberCount: number;
  maxMembers: number;
  expiresInDays: number;
  isJoined?: boolean;
  status: 'active' | 'closing_soon' | 'archived';
  tags: string[];
}

export interface CirclePost {
  id: string;
  circleId: string;
  author: string;
  content: string;
  timestamp: string;
  moderationStatus: 'published' | 'human_review' | 'safety_workflow';
  isCurrentUser?: boolean;
}

export const INITIAL_CIRCLES: SupportCircle[] = [
  {
    id: 'circle-1',
    title: 'Exam Stress & Pacing Circle',
    category: 'Exam Stress',
    description: 'A quiet, moderated space to share coping strategies, break study tasks into manageable chunks, and support each other through mid-terms.',
    moderator: 'Dr. Priya Nair (Campus Counsellor)',
    memberCount: 11,
    maxMembers: 15,
    expiresInDays: 5,
    isJoined: true,
    status: 'active',
    tags: ['Mid-terms', 'Pacing', 'Mindfulness']
  },
  {
    id: 'circle-2',
    title: 'First-Year Transition & Homesickness',
    category: 'First-Year Homesickness',
    description: 'Adjusting to campus life away from home for the first time. Share experiences and build connection in a confidential circle.',
    moderator: 'J. Bell (Well-being Guide)',
    memberCount: 14,
    maxMembers: 15,
    expiresInDays: 9,
    isJoined: false,
    status: 'active',
    tags: ['First-Year', 'Adjustment', 'Community']
  },
  {
    id: 'circle-3',
    title: 'Placement & Career Anxiety Support',
    category: 'Placement Anxiety',
    description: 'A space for students working through internship applications, interviews, and career uncertainty. Ground yourself with peer encouragement.',
    moderator: 'M. Vance (Career Counselor)',
    memberCount: 8,
    maxMembers: 12,
    expiresInDays: 12,
    isJoined: false,
    status: 'active',
    tags: ['Placements', 'Interviews', 'Resilience']
  },
  {
    id: 'circle-4',
    title: 'Hostel Loneliness & Evening Wind-down',
    category: 'Hostel Loneliness',
    description: 'Connecting students living in campus hostels who experience evening isolation or adjustment friction.',
    moderator: 'Dr. A. Rahman',
    memberCount: 12,
    maxMembers: 12,
    expiresInDays: 3,
    isJoined: false,
    status: 'closing_soon',
    tags: ['Hostel', 'Evening', 'Connection']
  },
  {
    id: 'circle-5',
    title: 'Academic Burnout & Recovery Circle',
    category: 'Academic Burnout',
    description: 'Recognizing exhaustion loops and prioritizing recovery intervals without guilt or pressure.',
    moderator: 'Dr. Priya Nair',
    memberCount: 10,
    maxMembers: 15,
    expiresInDays: 14,
    isJoined: false,
    status: 'active',
    tags: ['Burnout', 'Rest', 'Boundaries']
  },
  {
    id: 'circle-6',
    title: 'Relationship & Interpersonal Support Circle',
    category: 'Relationship Problems',
    description: 'Focused on interpersonal stress, communication friction, and boundary management in campus relationships and friendships.',
    moderator: 'Dr. A. Rahman (Counsellor)',
    memberCount: 7,
    maxMembers: 12,
    expiresInDays: 10,
    isJoined: false,
    status: 'active',
    tags: ['Relationships', 'Boundaries', 'Communication']
  }
];

export const INITIAL_POSTS: Record<string, CirclePost[]> = {
  'circle-1': [
    {
      id: 'post-1',
      circleId: 'circle-1',
      author: 'Anonymous Student',
      content: 'I have three exams in four days and I am freezing up on how to prioritize what to study first.',
      timestamp: '2 hours ago',
      moderationStatus: 'published'
    },
    {
      id: 'post-2',
      circleId: 'circle-1',
      author: 'Dr. Priya Nair (Moderator)',
      content: 'Thank you for sharing, student. When faced with multiple exams, try writing down just the top 2 core topics for each subject and commit to 25-minute focus blocks with 5-minute rest breaks.',
      timestamp: '1 hour ago',
      moderationStatus: 'published'
    }
  ],
  'circle-2': [
    {
      id: 'post-1',
      circleId: 'circle-2',
      author: 'Anonymous Student',
      content: 'First time living 500 miles away from family. Sunday evenings get particularly quiet here.',
      timestamp: 'Yesterday',
      moderationStatus: 'published'
    }
  ],
  'circle-6': [
    {
      id: 'post-1',
      circleId: 'circle-6',
      author: 'Anonymous Student',
      content: 'Balancing academic deadlines with roommate communication can feel overwhelming at times.',
      timestamp: '3 hours ago',
      moderationStatus: 'published'
    }
  ]
};
