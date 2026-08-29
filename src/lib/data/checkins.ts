import type { CheckIn } from '../types';

export const mockCheckIns: CheckIn[] = [
  { date: 'Today', mood: 3, energy: 2, stress: 3, sleep: 2, workload: 4, reflection: 'A little stretched, but I know what I need to do next.', assessmentEligibility: 'ELIGIBLE', isAssessmentEligible: true },
  { date: 'Yesterday', mood: 4, energy: 3, stress: 2, sleep: 3, workload: 3, reflection: 'The studio critique went better than expected.', assessmentEligibility: 'ELIGIBLE', isAssessmentEligible: true },
  { date: 'Mon 14', mood: 3, energy: 3, stress: 3, sleep: 2, workload: 4, reflection: 'Starting to feel the weight of two deadlines.', assessmentEligibility: 'ELIGIBLE', isAssessmentEligible: true },
];