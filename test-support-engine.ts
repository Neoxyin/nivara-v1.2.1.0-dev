import { buildSupportIndicator, type SupportSignals } from './lib/data/support-engine';

const academic: SupportSignals = {
  attendance: 72,
  attendanceDeclining: true,
  marksDeclining: true,
  overdueAssignments: 2,
  academicStress: 5,
  requestedHelp: true,
};

const result = buildSupportIndicator('Academic', academic, 'academic_data');
if (result.level !== 'HIGH') throw new Error(`Expected HIGH, received ${result.level}`);
if (!result.signals?.includes('Attendance below 75%')) throw new Error('Attendance rule missing');
if (!result.signals?.includes('Declining marks')) throw new Error('Marks rule missing');

const unavailable = buildSupportIndicator('Financial', academic, 'financial_support');
if (!unavailable.available) throw new Error('Financial rule should be available when permission is evaluated');

console.log('Support Need Engine smoke tests passed.');
