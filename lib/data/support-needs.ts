import type { SupportNeedProfileData } from '../types';

export const mockSupportNeeds: Record<string, SupportNeedProfileData> = {
  'default': {
    academic: {
      dimension: 'Academic',
      level: 'MODERATE',
      available: true,
      signals: ['Attendance below 75%', 'Consecutive missed tutorials'],
      lastUpdated: 'Today',
      explainability: {
        contributingFactors: [
          'Attendance below 75% in core modules.',
          'Consecutive missed tutorials over the last 2 weeks.'
        ],
        timeWindow: 'Last 14 days',
        dataUsed: ['Module attendance records', 'Coursework pacing data'],
        dataNotUsed: ['Library swipe data', 'Campus Wi-Fi logs']
      }
    },
    financial: {
      dimension: 'Financial',
      level: 'MILD',
      available: true,
      signals: ['Matched with 2 bursaries', 'Deadlines approaching'],
      lastUpdated: 'Yesterday',
      explainability: {
        contributingFactors: [
          'Profile matched with 2 new bursaries.',
          'Application deadlines are approaching within 7 days.'
        ],
        timeWindow: 'Current semester',
        dataUsed: ['Student profile demographics', 'Financial Aid directory'],
        dataNotUsed: ['Bank statements', 'Parental income records']
      }
    },
    wellbeing: {
      dimension: 'Well-being',
      level: 'LOW',
      available: true,
      signals: ['Recent check-ins show steady energy'],
      lastUpdated: 'Today',
      explainability: {
        contributingFactors: [
          'Recent well-being check-ins show steady energy levels.',
          'No significant changes in mood tracking.'
        ],
        timeWindow: 'Last 7 days',
        dataUsed: ['Voluntary well-being check-ins'],
        dataNotUsed: ['Health center records', 'Counselling notes']
      }
    }
  },
  'high_need': {
    academic: {
      dimension: 'Academic',
      level: 'HIGH',
      available: true,
      signals: ['Declining marks in 3 subjects', 'Pacing risk identified', 'Multiple overdue assignments'],
      lastUpdated: '2 hours ago',
      explainability: {
        contributingFactors: [
          'Declining marks in 3 core subjects.',
          'Algorithm identified a pacing risk based on assignment progression.',
          'Multiple overdue assignments detected.'
        ],
        timeWindow: 'Last 30 days',
        dataUsed: ['Assignment submission logs', 'Gradebook marks', 'VLE activity'],
        dataNotUsed: ['Extracurricular attendance']
      }
    },
    financial: {
      dimension: 'Financial',
      level: 'HIGH',
      available: true,
      signals: ['Eligibility for emergency grant triggered', 'Student requested help'],
      lastUpdated: 'Today',
      explainability: {
        contributingFactors: [
          'Eligibility for an emergency grant was automatically triggered.',
          'Student submitted a direct request for financial guidance.'
        ],
        timeWindow: 'Last 7 days',
        dataUsed: ['Student profile', 'Emergency fund criteria', 'Direct support requests'],
        dataNotUsed: ['External credit scores', 'Bank statements']
      }
    },
    wellbeing: {
      dimension: 'Well-being',
      level: 'HIGH',
      available: true,
      signals: ['Consistent low mood reported', 'High academic stress'],
      lastUpdated: 'Yesterday',
      explainability: {
        contributingFactors: [
          'Consistent low mood reported across consecutive check-ins.',
          'Self-reported high academic stress.'
        ],
        timeWindow: 'Last 14 days',
        dataUsed: ['Voluntary well-being check-ins'],
        dataNotUsed: ['Health center records', 'Private counselling notes']
      }
    }
  },
  'partial': {
    academic: {
      dimension: 'Academic',
      level: 'LOW',
      available: true,
      signals: ['Tracking well ahead of deadlines'],
      lastUpdated: '2 days ago',
      explainability: {
        contributingFactors: [
          'Tracking well ahead of assignment deadlines.'
        ],
        timeWindow: 'Current semester',
        dataUsed: ['Assignment progression'],
        dataNotUsed: []
      }
    },
    financial: {
      dimension: 'Financial',
      level: 'LOW',
      available: false
    },
    wellbeing: {
      dimension: 'Well-being',
      level: 'LOW',
      available: false
    }
  }
};
