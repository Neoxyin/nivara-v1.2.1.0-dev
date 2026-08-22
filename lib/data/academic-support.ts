import type { AcademicSupportOption } from '../types';

export const mockAcademicSupportOptions: AcademicSupportOption[] = [
  {
    id: 'advisor',
    category: 'Mentorship & Advising',
    title: 'Academic Advisor',
    shortDescription: 'Guidance on course selection, degree progress, and institutional policy.',
    purpose: 'Helps you map out your academic journey and resolve administrative roadblocks.',
    actionText: 'Book Advising Session',
    actionHref: '/counsellors',
    iconType: 'user-check'
  },
  {
    id: 'mentor',
    category: 'Mentorship & Advising',
    title: 'Faculty Mentor',
    shortDescription: 'Discussions about career pathways, research, and advanced subject interests.',
    purpose: 'Connect with a professor for long-term academic and professional guidance.',
    actionText: 'Find a Mentor',
    actionHref: '/counsellors',
    iconType: 'graduation-cap'
  },
  {
    id: 'tutoring',
    category: 'Peer & Collaborative',
    title: 'Peer Tutoring',
    shortDescription: '1-on-1 or group study sessions led by students who have excelled in the course.',
    purpose: 'Get help with specific assignments or difficult concepts in a low-pressure environment.',
    actionText: 'View Tutoring Schedule',
    actionHref: '/academics',
    iconType: 'users'
  },
  {
    id: 'workshops',
    category: 'Peer & Collaborative',
    title: 'Workshops',
    shortDescription: 'Group sessions focused on building specific academic or technical skills.',
    purpose: 'Learn new methodologies, software, or study techniques alongside peers.',
    actionText: 'Browse Workshops',
    actionHref: '/academics',
    iconType: 'layout-grid'
  },
  {
    id: 'subject',
    category: 'Resources & Preparation',
    title: 'Subject Resources',
    shortDescription: 'Library guides, past papers, and curated reading lists for your modules.',
    purpose: 'Deepen your understanding of course material through supplemental reading.',
    actionText: 'Access Library',
    actionHref: '/resources',
    iconType: 'book-open'
  },
  {
    id: 'study',
    category: 'Resources & Preparation',
    title: 'Study Resources',
    shortDescription: 'Tools and guides for effective note-taking, reading, and research strategies.',
    purpose: 'Improve your overall approach to learning and academic writing.',
    actionText: 'View Study Tools',
    actionHref: '/resources',
    iconType: 'file-text'
  },
  {
    id: 'exam',
    category: 'Resources & Preparation',
    title: 'Exam Preparation',
    shortDescription: 'Strategies for managing revision, practicing under timed conditions, and reducing test anxiety.',
    purpose: 'Perform at your best during formal assessments without burning out.',
    actionText: 'View Prep Guides',
    actionHref: '/resources',
    iconType: 'edit-3'
  },
  {
    id: 'time',
    category: 'Resources & Preparation',
    title: 'Time Management',
    shortDescription: 'Techniques for pacing workload, avoiding procrastination, and balancing life.',
    purpose: 'Create sustainable routines that protect your well-being while studying.',
    actionText: 'View Planners',
    actionHref: '/resources',
    iconType: 'clock'
  },
  {
    id: 'placement',
    category: 'Resources & Preparation',
    title: 'Placement Preparation',
    shortDescription: 'Support for securing internships, writing CVs, and practicing for interviews.',
    purpose: 'Translate your academic achievements into professional opportunities.',
    actionText: 'Career Services',
    actionHref: '/academics',
    iconType: 'briefcase'
  }
];
