export type AcademicSupportOption = {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  purpose: string;
  actionText: string;
  actionHref: string;
  iconType: string;
};

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
  trend: 'up' | 'steady' | 'down';
  attendedSessions?: number;
  totalSessions?: number;
  moduleCode?: string;
  nextSession?: string;
  pacingRisk?: 'low' | 'moderate' | 'healthy';
  suggestion?: string;
};

export type AcademicSuggestion = {
  id: string;
  category: 'attendance' | 'pacing' | 'support' | 'milestone';
  title: string;
  description: string;
  impact: string;
  actionText: string;
  actionHref: string;
  tone: 'accent' | 'warm' | 'plum';
};

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimetableClass = {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  subject: string;
  moduleCode: string;
  room: string;
  instructor?: string;
  type: 'lecture' | 'lab' | 'seminar' | 'studio';
  notes?: string;
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
  id: string;
  name: string; 
  role: string; 
  specializations: string[]; 
  availability: string; 
  status: 'available' | 'next' | 'away'; 
  initials: string;
  email?: string;
  phone?: string;
  activeCaseload?: number;
  location?: string;
  bio?: string;
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
  explainability?: {
    contributingFactors: string[];
    timeWindow?: string;
    dataUsed: string[];
    dataNotUsed?: string[];
  };
};

export type ConsentPreference = { 
  key: string; 
  label: string; 
  description: string; 
  enabled: boolean;
  required?: boolean;
};

export type AppointedSession = {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  course: string;
  year: number;
  counsellorName: string;
  sessionTime: string;
  sessionDate: string;
  status: 'requested' | 'pending' | 'accepted' | 'completed' | 'follow-up' | 'closed' | 'upcoming' | 'in-progress' | 'cancelled';
  sessionType: string;
  reason: string;
  notes?: string;
  academics: {
    overallRhythm: number;
    wellbeingScore: number;
    attendance: number;
    activeSubjects: AcademicMetric[];
    upcomingDeadlines: Deadline[];
    recentCheckIn: CheckIn;
    insights: Insight[];
  };
};

export type FinancialSupportOption = {
  id: string;
  type: string;
  shortExplanation: string;
  whyItMayHelp: string;
  actionText: string;
  actionHref: string;
  iconType: string;
};

export type SupportNeedLevel = 'LOW' | 'MILD' | 'MODERATE' | 'HIGH';
export type SupportDimension = 'Academic' | 'Financial' | 'Well-being';

export type SupportNeedIndicator = {
  dimension: SupportDimension;
  level: SupportNeedLevel;
  available: boolean;
  signals?: string[];
  lastUpdated?: string;
  explainability?: {
    contributingFactors: string[];
    timeWindow?: string;
    dataUsed: string[];
    dataNotUsed?: string[];
  };
};

export type SupportNeedProfileData = {
  academic: SupportNeedIndicator;
  financial: SupportNeedIndicator;
  wellbeing: SupportNeedIndicator;
};
