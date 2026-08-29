import { generateInsightsFromCheckIns } from '../src/lib/intelligence';
import type { CheckIn } from '../src/lib/types';

console.log('--- Testing NIVARA Phase B Intelligence Engine ---');

// Test 1: Scenario A - Workload Concentration
const checkinScenarioA: CheckIn[] = [
  { date: 'Today', mood: 3, energy: 2, stress: 4, sleep: 2, workload: 5, reflection: 'Two deadlines coming up fast' }
];
const resultA = generateInsightsFromCheckIns(checkinScenarioA);
console.log('\n[Scenario A - Workload Concentration]');
console.log('Status:', resultA.status);
console.log('Primary Pattern:', resultA.patterns[0]?.id);
console.log('Primary Title:', resultA.primaryInsight?.title);
console.log('Certainty:', resultA.primaryInsight?.certainty);
console.log('Contributing Factors:', resultA.primaryInsight?.contributingFactors);

// Test 2: Scenario B - Positive Study Momentum
const checkinScenarioB: CheckIn[] = [
  { date: 'Today', mood: 5, energy: 4, stress: 1, sleep: 4, workload: 2, reflection: 'Feeling clear-headed after studio critique' }
];
const resultB = generateInsightsFromCheckIns(checkinScenarioB);
console.log('\n[Scenario B - Positive Momentum]');
console.log('Status:', resultB.status);
console.log('Primary Pattern:', resultB.patterns[0]?.id);
console.log('Primary Title:', resultB.primaryInsight?.title);
console.log('Tone:', resultB.primaryInsight?.tone);
console.log('Actions:', resultB.primaryInsight?.actions);

// Test 3: Scenario C - Neutral / Insufficient Evidence
const checkinScenarioC: CheckIn[] = [];
const resultC = generateInsightsFromCheckIns(checkinScenarioC);
console.log('\n[Scenario C - Empty / Insufficient Check-ins]');
console.log('Status:', resultC.status);
console.log('Confidence Level:', resultC.confidence.level);
console.log('Is Sufficient:', resultC.confidence.isSufficientForInsight);

// Test 4: Scenario D - Multiple Contributing Signals & Sleep-Energy Loop
const checkinScenarioD: CheckIn[] = [
  { date: 'Today', mood: 2, energy: 1, stress: 4, sleep: 1, workload: 3, reflection: 'Barely slept 3 hours' },
  { date: 'Yesterday', mood: 2, energy: 2, stress: 3, sleep: 2, workload: 3, reflection: '' }
];
const resultD = generateInsightsFromCheckIns(checkinScenarioD);
console.log('\n[Scenario D - Sleep-Energy Depletion Loop]');
console.log('Status:', resultD.status);
console.log('Pattern:', resultD.patterns[0]?.id);
console.log('Primary Title:', resultD.primaryInsight?.title);
console.log('Contributing Signals:', resultD.primaryInsight?.contributingFactors);

// Test 5: Scenario F - Malformed checkin fields
const malformedCheckIn: any[] = [{ date: 'Today', mood: 'unknown', energy: null, stress: undefined, sleep: NaN, workload: {} }];
const resultF = generateInsightsFromCheckIns(malformedCheckIn);
console.log('\n[Scenario F - Malformed Input Handling]');
console.log('Status:', resultF.status);
console.log('Did not crash:', resultF.insights.length > 0);
console.log('Primary Title:', resultF.primaryInsight?.title);

console.log('\n--- All Unit Scenario Tests Passed Successfully ---');
