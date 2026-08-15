export type ConsentState = 'essential' | 'balanced' | 'full';
export type UserRole = 'student' | 'counsellor' | 'admin';

export type Student = { 
  name: string; 
  course: string; 
  year: number; 
  avatar: string; 
  role: UserRole; 
  consentState: ConsentState 
};

export type CheckIn = { 
  date: string; 
  mood: number; 
  energy: number; 
  stress: number; 
  sleep: number; 
  workload: number; 
  reflection: string 
};

export type AcademicMetric = { 
  subject: string; 
  score: number; 
  attendance: number; 
  workload: number; 
  trend: 'up' | 'steady' | 'down' 
};

export type Deadline = { 
  title: string; 
  subject: string; 
  date: string; 
  priority: 'high' | 'medium' | 'low' 
};

export type Insight = { 
  title: string; 
  summary: string; 
  contributingFactors: string[]; 
  certainty: string; 
  tone: 'watch' | 'steady' | 'positive'; 
  actions: string[] 
};

export type Counsellor = { 
  name: string; 
  role: string; 
  specializations: string[]; 
  availability: string; 
  status: 'available' | 'next' | 'away'; 
  initials: string 
};

export type Resource = { 
  title: string; 
  category: string; 
  readTime: string; 
  description: string; 
  featured: boolean 
};

export type Recommendation = { 
  title: string; 
  description: string; 
  type: string; 
  completed: boolean;
  why?: string;
};

export type ConsentPreference = { 
  key: string; 
  label: string; 
  description: string; 
  enabled: boolean 
};