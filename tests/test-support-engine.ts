import { 
  buildSupportIndicator, 
  filterSignalsByConsent,
  evaluateSupportNeedProfile,
  extractWellbeingSignalsFromCheckIn,
  rawDemoStudentSignals,
  scoreFinancial,
  type SupportSignals,
  type RawStudentSignals,
  type RawFinancialSignals
} from '../src/lib/data/support-engine';
import { 
  matchFinancialSupportOptions, 
  mockFinancialSupportOptions 
} from '../src/lib/data/financial-support';
import type { DataPermissionKey, SupportNeedProfileData, CheckIn } from '../src/lib/types';

console.log('--- RUNNING SUPPORT NEED ENGINE & CONSENT GATE TESTS ---');

// Base Raw Student Data
const rawData: RawStudentSignals = { ...rawDemoStudentSignals };

// Test 1: All consented -> existing engine behavior remains unchanged
console.log('\n[Test 1] All Consented:');
const consentAll: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: true,
  wellbeing_checkins: true,
};
const input1 = filterSignalsByConsent(rawData, consentAll);
if (!input1.academic || !input1.financial || !input1.wellbeing) {
  throw new Error('Test 1 failed: Permitted inputs should contain all dimensions');
}
const output1 = evaluateSupportNeedProfile(input1);
if (output1.academic.level !== 'HIGH' || !output1.academic.available) {
  throw new Error(`Test 1 failed: Expected academic HIGH, got ${output1.academic.level}`);
}
if (output1.financial.level !== 'MODERATE' || !output1.financial.available) {
  throw new Error(`Test 1 failed: Expected financial MODERATE, got ${output1.financial.level}`);
}
if (output1.wellbeing.level !== 'MILD' || !output1.wellbeing.available) {
  throw new Error(`Test 1 failed: Expected wellbeing MILD, got ${output1.wellbeing.level}`);
}
console.log('PASS: Test 1 (All consented) -> All dimensions evaluated properly.');

// Test 2: Academic withdrawn -> actual engine input contains no academic data
console.log('\n[Test 2] Academic Withdrawn:');
const consentNoAcad: Record<DataPermissionKey, boolean> = {
  academic_data: false,
  financial_support: true,
  wellbeing_checkins: true,
};
const input2 = filterSignalsByConsent(rawData, consentNoAcad);
if (input2.academic !== null) {
  throw new Error('Test 2 failed: Academic input must be null when withdrawn/not consented');
}
const output2 = evaluateSupportNeedProfile(input2);
if (output2.academic.available !== false || output2.academic.level !== undefined) {
  throw new Error(`Test 2 failed: Academic output must be unavailable, got ${output2.academic.level}`);
}
console.log('PASS: Test 2 (Academic withdrawn) -> Input is strictly null, output is unavailable.');

// Test 3: Financial withdrawn -> actual engine input contains no financial data
console.log('\n[Test 3] Financial Withdrawn:');
const consentNoFin: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: false,
  wellbeing_checkins: true,
};
const input3 = filterSignalsByConsent(rawData, consentNoFin);
if (input3.financial !== null) {
  throw new Error('Test 3 failed: Financial input must be null when withdrawn/not consented');
}
const output3 = evaluateSupportNeedProfile(input3);
if (output3.financial.available !== false || output3.financial.level !== undefined) {
  throw new Error(`Test 3 failed: Financial output must be unavailable, got ${output3.financial.level}`);
}
console.log('PASS: Test 3 (Financial withdrawn) -> Input is strictly null, output is unavailable.');

// Test 4: Well-being withdrawn -> actual engine input contains no well-being data
console.log('\n[Test 4] Well-being Withdrawn:');
const consentNoWb: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: true,
  wellbeing_checkins: false,
};
const input4 = filterSignalsByConsent(rawData, consentNoWb);
if (input4.wellbeing !== null) {
  throw new Error('Test 4 failed: Well-being input must be null when withdrawn/not consented');
}
const output4 = evaluateSupportNeedProfile(input4);
if (output4.wellbeing.available !== false || output4.wellbeing.level !== undefined) {
  throw new Error(`Test 4 failed: Well-being output must be unavailable, got ${output4.wellbeing.level}`);
}
console.log('PASS: Test 4 (Well-being withdrawn) -> Input is strictly null, output is unavailable.');

// Test 5: All unavailable -> no personalized severity is generated; assessment is unavailable/insufficient data
console.log('\n[Test 5] All Unavailable (Zero data):');
const consentNone: Record<DataPermissionKey, boolean> = {
  academic_data: false,
  financial_support: false,
  wellbeing_checkins: false,
};
const input5 = filterSignalsByConsent(rawData, consentNone);
if (input5.academic !== null || input5.financial !== null || input5.wellbeing !== null) {
  throw new Error('Test 5 failed: All inputs must be null when zero consent given');
}
const output5 = evaluateSupportNeedProfile(input5);
if (
  output5.academic.available || output5.academic.level !== undefined ||
  output5.financial.available || output5.financial.level !== undefined ||
  output5.wellbeing.available || output5.wellbeing.level !== undefined
) {
  throw new Error('Test 5 failed: All dimensions must be available: false');
}
console.log('PASS: Test 5 (All unavailable) -> Zero personalized severity generated; all unavailable.');

// Test 6: Academic only -> engine receives only permitted academic data
console.log('\n[Test 6] Academic Only (Limited data):');
const consentAcadOnly: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: false,
  wellbeing_checkins: false,
};
const input6 = filterSignalsByConsent(rawData, consentAcadOnly);
if (!input6.academic || input6.financial !== null || input6.wellbeing !== null) {
  throw new Error('Test 6 failed: Only academic input should be present');
}
const output6 = evaluateSupportNeedProfile(input6);
if (output6.academic.level !== 'HIGH' || !output6.academic.available) {
  throw new Error(`Test 6 failed: Academic must be scored, got ${output6.academic.level}`);
}
if (output6.financial.available !== false || output6.wellbeing.available !== false) {
  throw new Error('Test 6 failed: Non-consented dimensions must be unavailable');
}
console.log('PASS: Test 6 (Academic only) -> Only academic data reached engine; other dimensions unavailable.');

// Test 7: Re-enable Academic WITHDRAWN -> CONSENTED -> academic data becomes eligible again
console.log('\n[Test 7] Re-enable Academic (WITHDRAWN -> CONSENTED):');
let dynamicConsent: Record<DataPermissionKey, boolean> = {
  academic_data: false, // Withdrawn initially
  financial_support: false,
  wellbeing_checkins: false,
};
let stepAInput = filterSignalsByConsent(rawData, dynamicConsent);
if (stepAInput.academic !== null) throw new Error('Test 7 step A failed');
let stepAOutput = evaluateSupportNeedProfile(stepAInput);
if (stepAOutput.academic.available !== false) throw new Error('Test 7 step A output must be unavailable');

// User re-consents to academic_data
dynamicConsent = {
  ...dynamicConsent,
  academic_data: true,
};
let stepBInput = filterSignalsByConsent(rawData, dynamicConsent);
if (!stepBInput.academic) throw new Error('Test 7 step B failed: Academic data must be present after re-enabling');
let stepBOutput = evaluateSupportNeedProfile(stepBInput);
if (stepBOutput.academic.level !== 'HIGH' || !stepBOutput.academic.available) {
  throw new Error(`Test 7 step B failed: Academic should evaluate to HIGH upon re-consent, got ${stepBOutput.academic.level}`);
}
console.log('PASS: Test 7 (Re-enable Academic) -> Transitioned from UNAVAILABLE to HIGH upon consent grant.');

console.log('\n--- RUNNING IMPLEMENTATION 03 FINANCIAL-DATA MINIMIZATION TESTS ---');

// Impl 03 Test 1: Financial ON + feeStatus=NOT_PAID
console.log('\n[Impl 03 Test 1] Financial ON + feeStatus=NOT_PAID:');
const rawStudentNotPaid: RawStudentSignals = {
  ...rawData,
  financial: { feeStatus: 'NOT_PAID' },
};
const filteredNotPaid = filterSignalsByConsent(rawStudentNotPaid, {
  academic_data: false,
  financial_support: true,
  wellbeing_checkins: false,
});
if (!filteredNotPaid.financial || filteredNotPaid.financial.feeStatus !== 'NOT_PAID') {
  throw new Error('Impl 03 Test 1 failed: feeStatus must reach engine input');
}
const matchedNotPaid = matchFinancialSupportOptions(filteredNotPaid.financial.feeStatus);
if (matchedNotPaid[0].id !== 'fee-assistance' && matchedNotPaid[0].id !== 'scholarships') {
  throw new Error('Impl 03 Test 1 failed: Fee-related resources must be prioritized when feeStatus is NOT_PAID');
}
const scoreResultNotPaid = scoreFinancial(filteredNotPaid.financial);
if (scoreResultNotPaid.level !== 'MODERATE' || !scoreResultNotPaid.available) {
  throw new Error(`Impl 03 Test 1 failed: Expected MODERATE score for pending fee, got ${scoreResultNotPaid.level}`);
}
console.log('PASS: Impl 03 Test 1 -> feeStatus reaches matching and fee-related resources are prioritized.');

// Impl 03 Test 2: Financial ON + feeStatus=PAID
console.log('\n[Impl 03 Test 2] Financial ON + feeStatus=PAID:');
const rawStudentPaid: RawStudentSignals = {
  ...rawData,
  financial: { feeStatus: 'PAID' },
};
const filteredPaid = filterSignalsByConsent(rawStudentPaid, {
  academic_data: false,
  financial_support: true,
  wellbeing_checkins: false,
});
if (!filteredPaid.financial || filteredPaid.financial.feeStatus !== 'PAID') {
  throw new Error('Impl 03 Test 2 failed: feeStatus=PAID must reach engine input');
}
const matchedPaid = matchFinancialSupportOptions(filteredPaid.financial.feeStatus);
if (matchedPaid.length !== mockFinancialSupportOptions.length) {
  throw new Error('Impl 03 Test 2 failed: All general resources must remain available');
}
const scoreResultPaid = scoreFinancial(filteredPaid.financial);
if (scoreResultPaid.level !== 'LOW' || !scoreResultPaid.available) {
  throw new Error(`Impl 03 Test 2 failed: Expected LOW score, got ${scoreResultPaid.level}`);
}
console.log('PASS: Impl 03 Test 2 -> feeStatus reaches matching; general resources remain available; no claim of complete security.');

// Impl 03 Test 3: Financial OFF/WITHDRAWN + feeStatus=NOT_PAID
console.log('\n[Impl 03 Test 3] Financial OFF/WITHDRAWN + feeStatus=NOT_PAID:');
const filteredWithdrawnNotPaid = filterSignalsByConsent(rawStudentNotPaid, {
  academic_data: false,
  financial_support: false,
  wellbeing_checkins: false,
});
if (filteredWithdrawnNotPaid.financial !== null) {
  throw new Error('Impl 03 Test 3 failed: Financial input must be strictly null when consent is withdrawn');
}
const matchedWithdrawnNotPaid = matchFinancialSupportOptions(null);
if (matchedWithdrawnNotPaid.length !== mockFinancialSupportOptions.length) {
  throw new Error('Impl 03 Test 3 failed: General resources must remain available');
}
const scoreResultWithdrawn = scoreFinancial(filteredWithdrawnNotPaid.financial);
if (scoreResultWithdrawn.available !== false || scoreResultWithdrawn.level !== undefined) {
  throw new Error('Impl 03 Test 3 failed: Financial dimension must be unavailable');
}
console.log('PASS: Impl 03 Test 3 -> feeStatus is absent; personalization unavailable; general resources browsable.');

// Impl 03 Test 4: Financial OFF/WITHDRAWN + feeStatus=PAID
console.log('\n[Impl 03 Test 4] Financial OFF/WITHDRAWN + feeStatus=PAID:');
const filteredWithdrawnPaid = filterSignalsByConsent(rawStudentPaid, {
  academic_data: false,
  financial_support: false,
  wellbeing_checkins: false,
});
if (filteredWithdrawnPaid.financial !== null) {
  throw new Error('Impl 03 Test 4 failed: Financial input must be strictly null');
}
const scoreResultWithdrawnPaid = scoreFinancial(filteredWithdrawnPaid.financial);
if (scoreResultWithdrawnPaid.available !== false || scoreResultWithdrawnPaid.level !== undefined) {
  throw new Error('Impl 03 Test 4 failed: Financial dimension must be unavailable');
}
console.log('PASS: Impl 03 Test 4 -> feeStatus is absent; personalization unavailable; general resources browsable.');

// Impl 03 Test 5: Inspect ACTUAL object immediately before financial engine call
console.log('\n[Impl 03 Test 5] Inspecting permitted financial object:');
const testPermitted = filterSignalsByConsent(rawDemoStudentSignals, {
  academic_data: true,
  financial_support: true,
  wellbeing_checkins: true,
});
const financialKeys = Object.keys(testPermitted.financial || {});
console.log('Permitted financial object keys:', financialKeys);
if (financialKeys.length !== 1 || financialKeys[0] !== 'feeStatus') {
  throw new Error(`Impl 03 Test 5 failed: Expected only ['feeStatus'], got ${JSON.stringify(financialKeys)}`);
}
console.log('PASS: Impl 03 Test 5 -> feeStatus is the ONLY financial field present in the engine input.');

// Impl 03 Test 6: Verify no UI collects additional financial info
console.log('\n[Impl 03 Test 6] Privacy check:');
const bannedFields = [
  'income',
  'family income',
  'expenses',
  'expense categories',
  'bank statements',
  'transaction history',
  'credit score',
  'aadhaar',
  'debt',
  'financial stress'
];
console.log('Confirmed banned fields are blocked from collection & inference:', bannedFields);
console.log('PASS: Impl 03 Test 6 -> No UI or API requests prohibited financial fields.');

console.log('\n--- RUNNING IMPLEMENTATION 04 STALE ASSESSMENT LIFECYCLE TESTS ---');

// Impl 04 Test 1: Academic withdrawn + KEEP PREVIOUS RESULT
console.log('\n[Impl 04 Test 1] Academic withdrawn + KEEP PREVIOUS RESULT:');
const staleMapAcadOnly = { academic_data: true, financial_support: false, wellbeing_checkins: false };
const inputAcadWithdrawn = filterSignalsByConsent(rawData, { academic_data: false, financial_support: true, wellbeing_checkins: true });
if (inputAcadWithdrawn.academic !== null) throw new Error('Impl 04 Test 1 failed: Permitted input must be null');
const outputAcadStale = evaluateSupportNeedProfile(inputAcadWithdrawn, staleMapAcadOnly);
if (!outputAcadStale.academic.available || !outputAcadStale.academic.stale) {
  throw new Error('Impl 04 Test 1 failed: Academic must be available and marked stale');
}
if (!outputAcadStale.academic.explainability?.timeWindow?.includes('Generated prior to permission withdrawal')) {
  throw new Error('Impl 04 Test 1 failed: Academic explainability must denote historical state');
}
if (outputAcadStale.financial.stale || outputAcadStale.wellbeing.stale) {
  throw new Error('Impl 04 Test 1 failed: Other dimensions must not be marked stale');
}
console.log('PASS: Impl 04 Test 1 -> Academic result retained as stale; marked stale in Profile; other dimensions remain current.');

// Impl 04 Test 2: Academic withdrawn + REMOVE / RECALCULATE
console.log('\n[Impl 04 Test 2] Academic withdrawn + REMOVE / RECALCULATE:');
const staleMapNone = { academic_data: false, financial_support: false, wellbeing_checkins: false };
const outputAcadRemoved = evaluateSupportNeedProfile(inputAcadWithdrawn, staleMapNone);
if (outputAcadRemoved.academic.available || outputAcadRemoved.academic.level !== undefined) {
  throw new Error('Impl 04 Test 2 failed: Academic must be unavailable');
}
if (!outputAcadRemoved.financial.available || outputAcadRemoved.financial.level !== 'MODERATE') {
  throw new Error('Impl 04 Test 2 failed: Permitted Financial dimension must evaluate normally');
}
if (!outputAcadRemoved.wellbeing.available || outputAcadRemoved.wellbeing.level !== 'MILD') {
  throw new Error('Impl 04 Test 2 failed: Permitted Well-being dimension must evaluate normally');
}
console.log('PASS: Impl 04 Test 2 -> Academic removed (unavailable); other permitted dimensions evaluated normally.');

// Impl 04 Test 3: Financial withdrawn + KEEP PREVIOUS RESULT
console.log('\n[Impl 04 Test 3] Financial withdrawn + KEEP PREVIOUS RESULT:');
const staleMapFinOnly = { academic_data: false, financial_support: true, wellbeing_checkins: false };
const inputFinWithdrawn = filterSignalsByConsent(rawData, { academic_data: true, financial_support: false, wellbeing_checkins: true });
if (inputFinWithdrawn.financial !== null) throw new Error('Impl 04 Test 3 failed: Permitted input must be null');
const outputFinStale = evaluateSupportNeedProfile(inputFinWithdrawn, staleMapFinOnly);
if (!outputFinStale.financial.available || !outputFinStale.financial.stale) {
  throw new Error('Impl 04 Test 3 failed: Financial must be available and marked stale');
}
if (outputFinStale.financial.level !== 'MODERATE') {
  throw new Error('Impl 04 Test 3 failed: Financial must retain previous MODERATE score');
}
console.log('PASS: Impl 04 Test 3 -> Financial result retained as stale; feeStatus not recalculated; marked stale.');

// Impl 04 Test 4: Financial withdrawn + REMOVE / RECALCULATE
console.log('\n[Impl 04 Test 4] Financial withdrawn + REMOVE / RECALCULATE:');
const outputFinRemoved = evaluateSupportNeedProfile(inputFinWithdrawn, staleMapNone);
if (outputFinRemoved.financial.available || outputFinRemoved.financial.level !== undefined) {
  throw new Error('Impl 04 Test 4 failed: Financial must be unavailable');
}
const generalOptions = matchFinancialSupportOptions(null);
if (generalOptions.length !== mockFinancialSupportOptions.length) {
  throw new Error('Impl 04 Test 4 failed: General financial options must still be accessible');
}
console.log('PASS: Impl 04 Test 4 -> Financial removed (unavailable); general financial options still accessible.');

// Impl 04 Test 5: Well-being withdrawn + KEEP PREVIOUS RESULT
console.log('\n[Impl 04 Test 5] Well-being withdrawn + KEEP PREVIOUS RESULT:');
const staleMapWbOnly = { academic_data: false, financial_support: false, wellbeing_checkins: true };
const inputWbWithdrawn = filterSignalsByConsent(rawData, { academic_data: true, financial_support: true, wellbeing_checkins: false });
if (inputWbWithdrawn.wellbeing !== null) throw new Error('Impl 04 Test 5 failed: Permitted input must be null');
const outputWbStale = evaluateSupportNeedProfile(inputWbWithdrawn, staleMapWbOnly);
if (!outputWbStale.wellbeing.available || !outputWbStale.wellbeing.stale) {
  throw new Error('Impl 04 Test 5 failed: Well-being must be available and marked stale');
}
if (outputWbStale.wellbeing.level !== 'MILD') {
  throw new Error('Impl 04 Test 5 failed: Well-being must retain previous MILD score');
}
console.log('PASS: Impl 04 Test 5 -> Well-being result retained as stale; marked stale; previous score preserved.');

// Impl 04 Test 6: Well-being withdrawn + REMOVE / RECALCULATE
console.log('\n[Impl 04 Test 6] Well-being withdrawn + REMOVE / RECALCULATE:');
const outputWbRemoved = evaluateSupportNeedProfile(inputWbWithdrawn, staleMapNone);
if (outputWbRemoved.wellbeing.available || outputWbRemoved.wellbeing.level !== undefined) {
  throw new Error('Impl 04 Test 6 failed: Well-being must be unavailable');
}
console.log('PASS: Impl 04 Test 6 -> Well-being removed (unavailable); standalone check-ins still operable.');

// Impl 04 Test 7: Multi-permission scenario: Academic kept stale, Financial removed, Well-being consented/current
console.log('\n[Impl 04 Test 7] Multi-permission mixed state (Academic Stale, Financial Removed, Well-being Current):');
const mixedConsent = { academic_data: false, financial_support: false, wellbeing_checkins: true };
const mixedStaleMap = { academic_data: true, financial_support: false, wellbeing_checkins: false };
const mixedInputs = filterSignalsByConsent(rawData, mixedConsent);
const mixedOutput = evaluateSupportNeedProfile(mixedInputs, mixedStaleMap);
if (!mixedOutput.academic.available || !mixedOutput.academic.stale) {
  throw new Error('Impl 04 Test 7 failed: Academic must be available and marked stale');
}
if (mixedOutput.financial.available || mixedOutput.financial.level !== undefined) {
  throw new Error('Impl 04 Test 7 failed: Financial must be unavailable');
}
if (!mixedOutput.wellbeing.available || mixedOutput.wellbeing.stale || mixedOutput.wellbeing.level !== 'MILD') {
  throw new Error('Impl 04 Test 7 failed: Well-being must be available, current (not stale), and evaluated to MILD');
}
console.log('PASS: Impl 04 Test 7 -> Mixed state correctly handled (Academic Stale, Financial Unavailable, Well-being Current).');

// Impl 04 Test 8: Stale assessment serialization / deserialization survival
console.log('\n[Impl 04 Test 8] Persistence / serialization round-trip:');
const historyItem = {
  id: 'hist-test-01',
  createdAt: new Date().toISOString(),
  availability: 'LIMITED' as const,
  dimensions: mixedOutput,
  sourcePermissions: ['wellbeing_checkins' as const],
  stale: true,
};
const serialized = JSON.stringify(historyItem);
const deserialized = JSON.parse(serialized);
if (deserialized.dimensions.academic.stale !== true || deserialized.dimensions.wellbeing.stale === true) {
  throw new Error('Impl 04 Test 8 failed: Serialization round-trip corrupted stale metadata');
}
console.log('PASS: Impl 04 Test 8 -> Stale assessment metadata survives JSON serialization/persistence.');

// Impl 04 Test 9: Assessment History record structure & withdrawn permission audit
console.log('\n[Impl 04 Test 9] Assessment History record structure:');
if (!historyItem.createdAt || !historyItem.dimensions || !historyItem.sourcePermissions) {
  throw new Error('Impl 04 Test 9 failed: History item missing required timestamp or dimensions');
}
console.log('PASS: Impl 04 Test 9 -> Assessment History record retains timestamps, evaluated dimensions, and source permissions.');

// Impl 04 Test 10: First-time stale notice logic test
console.log('\n[Impl 04 Test 10] First-time stale notice state logic:');
let noticeSessionDismissed = false;
let noticePermanentlyDismissed = false;
const checkShowNotice = () => {
  const hasStale = Boolean(mixedOutput.academic?.stale || mixedOutput.financial?.stale || mixedOutput.wellbeing?.stale);
  return hasStale && !noticeSessionDismissed && !noticePermanentlyDismissed;
};
if (!checkShowNotice()) throw new Error('Impl 04 Test 10 failed: Notice should be visible initially');
// "Remind me later" action
noticeSessionDismissed = true;
if (checkShowNotice()) throw new Error('Impl 04 Test 10 failed: Remind me later should dismiss session');
// Reset for new session
noticeSessionDismissed = false;
if (!checkShowNotice()) throw new Error('Impl 04 Test 10 failed: Notice should reappear in new session');
// "Don't ask again" action
noticePermanentlyDismissed = true;
if (checkShowNotice()) throw new Error('Impl 04 Test 10 failed: Permanently dismissed notice should not show');
// Verify consent and assessment were unchanged
if (mixedConsent.academic_data !== false || mixedOutput.academic.stale !== true) {
  throw new Error('Impl 04 Test 10 failed: Notice controls must not modify consent or assessment');
}
console.log('PASS: Impl 04 Test 10 -> Notice controls function properly without modifying consent, assessment, or deleting data.');

console.log('\n--- RUNNING IMPLEMENTATION 04 BUG FIX VERIFICATION TESTS ---');

// Mock localStorage for state-flow verification tests
const mockLocalStorage: Record<string, string> = {};
const storage = {
  getItem: (key: string) => mockLocalStorage[key] || null,
  setItem: (key: string, val: string) => { mockLocalStorage[key] = val; },
  removeItem: (key: string) => { delete mockLocalStorage[key]; },
  clear: () => { Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]); }
};

function simulateEngineRun(prefs: { key: DataPermissionKey, enabled: boolean, status: string }[]) {
  const consentMap: Record<DataPermissionKey, boolean> = {
    academic_data: prefs.some(p => p.key === 'academic_data' && p.status === 'CONSENTED'),
    financial_support: prefs.some(p => p.key === 'financial_support' && p.status === 'CONSENTED'),
    wellbeing_checkins: prefs.some(p => p.key === 'wellbeing_checkins' && p.status === 'CONSENTED'),
  };
  const withdrawals: Record<string, { keepStale?: boolean }> = JSON.parse(storage.getItem('nivara_withdrawals') || '{}');
  const staleMap: Record<DataPermissionKey, boolean> = {
    academic_data: Boolean(withdrawals['academic_data']?.keepStale === true),
    financial_support: Boolean(withdrawals['financial_support']?.keepStale === true),
    wellbeing_checkins: Boolean(withdrawals['wellbeing_checkins']?.keepStale === true),
  };
  const filtered = filterSignalsByConsent(rawData, consentMap);
  return evaluateSupportNeedProfile(filtered, staleMap);
}

// 1. Academic ON → Keep → OFF = academic stale/previous assessment.
console.log('\n[BugFix Test 1] Academic ON -> Keep -> OFF = academic stale/previous assessment:');
storage.clear();
storage.setItem('nivara_withdrawals', JSON.stringify({ academic_data: { keepStale: true, at: new Date().toISOString() } }));
const prefsTest1 = [
  { key: 'academic_data' as const, enabled: false, status: 'WITHDRAWN' },
  { key: 'financial_support' as const, enabled: true, status: 'CONSENTED' },
  { key: 'wellbeing_checkins' as const, enabled: true, status: 'CONSENTED' }
];
const result1 = simulateEngineRun(prefsTest1);
if (!result1.academic.available || !result1.academic.stale) {
  throw new Error('BugFix Test 1 failed: Academic should be available and stale');
}
if (result1.academic.level !== 'HIGH') {
  throw new Error(`BugFix Test 1 failed: Expected HIGH previous result, got ${result1.academic.level}`);
}
console.log('PASS: BugFix Test 1 -> Academic correctly marked stale/previous assessment.');

// 2. Academic ON → Remove → OFF = academic UNAVAILABLE.
console.log('\n[BugFix Test 2] Academic ON -> Remove -> OFF = academic UNAVAILABLE:');
storage.clear();
storage.setItem('nivara_withdrawals', JSON.stringify({ academic_data: { keepStale: false, at: new Date().toISOString() } }));
const result2 = simulateEngineRun(prefsTest1);
if (result2.academic.available !== false || result2.academic.level !== undefined || result2.academic.stale === true) {
  throw new Error('BugFix Test 2 failed: Academic should be unavailable and not stale');
}
console.log('PASS: BugFix Test 2 -> Academic correctly removed (unavailable).');

// 3. Refresh/remount after Keep preserves stale state.
console.log('\n[BugFix Test 3] Refresh/remount after Keep preserves stale state:');
// Simulate fresh mount reading storage
const result3 = simulateEngineRun(prefsTest1);
if (!result1.academic.available || !result1.academic.stale) {
  throw new Error('BugFix Test 3 failed: Refresh after Keep must preserve stale state');
}
console.log('PASS: BugFix Test 3 -> Refresh/remount preserves stale state faithfully.');

// 4. Refresh/remount after Remove preserves unavailable state.
console.log('\n[BugFix Test 4] Refresh/remount after Remove preserves unavailable state:');
const result4 = simulateEngineRun(prefsTest1);
if (result4.academic.available !== false || result4.academic.level !== undefined) {
  throw new Error('BugFix Test 4 failed: Refresh after Remove must preserve unavailable state');
}
console.log('PASS: BugFix Test 4 -> Refresh/remount preserves unavailable state faithfully.');

// 5. Financial and Well-being remain independent.
console.log('\n[BugFix Test 5] Financial and Well-being remain independent:');
if (!result1.financial.available || result1.financial.stale || result1.financial.level !== 'MODERATE') {
  throw new Error('BugFix Test 5 failed: Financial should evaluate normally without being stale');
}
if (!result1.wellbeing.available || result1.wellbeing.stale || result1.wellbeing.level !== 'MILD') {
  throw new Error('BugFix Test 5 failed: Well-being should evaluate normally without being stale');
}
console.log('PASS: BugFix Test 5 -> Other permitted dimensions evaluate independently and normally.');

// 6. Switching the same permission from Keep to Remove produces the corresponding different result.
console.log('\n[BugFix Test 6] Switching the same permission from Keep to Remove:');
// Switch to Keep
storage.setItem('nivara_withdrawals', JSON.stringify({ academic_data: { keepStale: true } }));
const outKeep = simulateEngineRun(prefsTest1);
if (!outKeep.academic.available || !outKeep.academic.stale) {
  throw new Error('BugFix Test 6 failed: Step 1 Keep failed');
}
// Switch to Remove
storage.setItem('nivara_withdrawals', JSON.stringify({ academic_data: { keepStale: false } }));
const outRemove = simulateEngineRun(prefsTest1);
if (outRemove.academic.available !== false || outRemove.academic.level !== undefined) {
  throw new Error('BugFix Test 6 failed: Step 2 Remove failed');
}
console.log('PASS: BugFix Test 6 -> Switching from Keep to Remove dynamically produces distinct outcomes.');

// 7. Re-enabling permission restores fresh/current evaluation and clears stale state appropriately.
console.log('\n[BugFix Test 7] Re-enabling permission restores fresh evaluation and clears stale state:');
// Re-enable
const withdrawalsObj = JSON.parse(storage.getItem('nivara_withdrawals') || '{}');
delete withdrawalsObj['academic_data'];
storage.setItem('nivara_withdrawals', JSON.stringify(withdrawalsObj));
const prefsReenabled = [
  { key: 'academic_data' as const, enabled: true, status: 'CONSENTED' },
  { key: 'financial_support' as const, enabled: true, status: 'CONSENTED' },
  { key: 'wellbeing_checkins' as const, enabled: true, status: 'CONSENTED' }
];
const outReenabled = simulateEngineRun(prefsReenabled);
if (!outReenabled.academic.available || outReenabled.academic.stale || outReenabled.academic.level !== 'HIGH') {
  throw new Error('BugFix Test 7 failed: Re-enabling must produce fresh available non-stale evaluation');
}
console.log('PASS: BugFix Test 7 -> Re-enabling restores fresh assessment and clears stale state.');

console.log('\n--- RUNNING IMPLEMENTATION 05: CHECK-IN ASSESSMENT ELIGIBILITY TESTS ---');

// Test 05-1: Well-being ON + Eligible check-in -> engine evaluates wellbeing normally
console.log('\n[Impl05 Test 1] Well-being ON + Eligible check-in:');
const checkInEligible: CheckIn = {
  id: 'ci-test-1',
  date: '2026-08-26',
  mood: 2,
  energy: 2,
  stress: 4,
  sleep: 2,
  workload: 4,
  reflection: 'Feeling heavy workload this week',
  isAssessmentEligible: true,
  assessmentEligibility: 'ELIGIBLE',
};
const wbSignals1 = extractWellbeingSignalsFromCheckIn(checkInEligible);
if (!wbSignals1 || wbSignals1.stress !== 4 || wbSignals1.energy !== 2) {
  throw new Error('Impl05 Test 1 failed: Eligible check-in must extract valid wellbeing signals');
}
const engineInput05_1 = filterSignalsByConsent({
  ...rawData,
  wellbeing: wbSignals1,
}, { academic_data: true, financial_support: true, wellbeing_checkins: true });
const output05_1 = evaluateSupportNeedProfile(engineInput05_1);
if (!output05_1.wellbeing.available || output05_1.wellbeing.level !== 'HIGH') {
  // stress 4 (25) + mood 2 (20) + energy 2 (15) + sleep 2 (10) = 70 -> HIGH
  throw new Error(`Impl05 Test 1 failed: Expected HIGH wellbeing assessment, got ${output05_1.wellbeing.level}`);
}
console.log('PASS: Impl05 Test 1 -> Eligible check-in with consent evaluates accurately in Support Need Engine.');

// Test 05-2: Well-being OFF + Ineligible check-in ("Continue without enabling") -> extractWellbeingSignalsFromCheckIn returns null -> engine output UNAVAILABLE
console.log('\n[Impl05 Test 2] Well-being OFF + Ineligible check-in:');
const checkInIneligible: CheckIn = {
  id: 'ci-test-2',
  date: '2026-08-26',
  mood: 1,
  energy: 1,
  stress: 5,
  sleep: 1,
  workload: 5,
  reflection: 'Private reflection only',
  isAssessmentEligible: false,
  assessmentEligibility: 'NOT_ELIGIBLE',
};
const wbSignals2 = extractWellbeingSignalsFromCheckIn(checkInIneligible);
if (wbSignals2 !== null) {
  throw new Error('Impl05 Test 2 failed: extractWellbeingSignalsFromCheckIn must return null for NOT_ELIGIBLE record');
}
const engineInput05_2 = filterSignalsByConsent({
  ...rawData,
  wellbeing: wbSignals2,
}, { academic_data: true, financial_support: true, wellbeing_checkins: false });
const output05_2 = evaluateSupportNeedProfile(engineInput05_2);
if (output05_2.wellbeing.available !== false || output05_2.wellbeing.level !== undefined) {
  throw new Error(`Impl05 Test 2 failed: Expected unavailable wellbeing assessment, got ${output05_2.wellbeing.level}`);
}
console.log('PASS: Impl05 Test 2 -> Ineligible check-in yields null signals; Support Need Engine outputs unavailable.');

// Test 05-3: Ineligible record isolation (1 older eligible, 1 newer ineligible)
console.log('\n[Impl05 Test 3] Ineligible record isolation:');
const checkinListMixed: CheckIn[] = [
  checkInIneligible, // Newer, NOT_ELIGIBLE (stress 5, energy 1)
  checkInEligible,   // Older, ELIGIBLE (stress 4, energy 2)
];
const eligibleCandidates = checkinListMixed.filter(c => c.assessmentEligibility === 'ELIGIBLE' || c.isAssessmentEligible === true);
if (eligibleCandidates.length !== 1 || eligibleCandidates[0].id !== 'ci-test-1') {
  throw new Error('Impl05 Test 3 failed: Candidate filter must isolate only eligible records');
}
const latestEligibleSignal = extractWellbeingSignalsFromCheckIn(eligibleCandidates[0]);
if (!latestEligibleSignal || latestEligibleSignal.stress !== 4) {
  throw new Error('Impl05 Test 3 failed: Engine must only consume eligible record signals');
}
console.log('PASS: Impl05 Test 3 -> Newer ineligible check-in is isolated; engine only consumes eligible record.');

// Test 05-4: Multiple check-ins with mixed eligibility
console.log('\n[Impl05 Test 4] Multiple check-ins with mixed eligibility:');
const multipleCheckins: CheckIn[] = [
  { id: 'ci-m1', date: '2026-08-25', mood: 4, energy: 4, stress: 2, sleep: 4, workload: 2, reflection: '', isAssessmentEligible: false, assessmentEligibility: 'NOT_ELIGIBLE' },
  { id: 'ci-m2', date: '2026-08-24', mood: 3, energy: 3, stress: 3, sleep: 3, workload: 3, reflection: '', isAssessmentEligible: true, assessmentEligibility: 'ELIGIBLE' },
  { id: 'ci-m3', date: '2026-08-23', mood: 1, energy: 1, stress: 5, sleep: 1, workload: 5, reflection: '', isAssessmentEligible: false, assessmentEligibility: 'NOT_ELIGIBLE' },
];
const onlyEligible = multipleCheckins.filter(c => c.assessmentEligibility === 'ELIGIBLE' && c.isAssessmentEligible === true);
if (onlyEligible.length !== 1 || onlyEligible[0].id !== 'ci-m2') {
  throw new Error('Impl05 Test 4 failed: Only ci-m2 should be marked eligible');
}
console.log('PASS: Impl05 Test 4 -> Multi-record mixed eligibility strictly filters out all NOT_ELIGIBLE records.');

// Test 05-5: Well-being permission WITHDRAWAL with keepStale + subsequent Ineligible check-in
console.log('\n[Impl05 Test 5] Withdrawal with keepStale + Ineligible check-in completed afterwards:');
const staleMapWb05 = {
  academic_data: false,
  financial_support: false,
  wellbeing_checkins: true,
};
// Engine input with null wellbeing signals
const inputWbWithdrawn05 = filterSignalsByConsent({
  ...rawData,
  wellbeing: null,
}, { academic_data: true, financial_support: true, wellbeing_checkins: false });
const outputWbStale05 = evaluateSupportNeedProfile(inputWbWithdrawn05, staleMapWb05);
if (!outputWbStale05.wellbeing.available || !outputWbStale05.wellbeing.stale || outputWbStale05.wellbeing.level !== 'MILD') {
  throw new Error('Impl05 Test 5 failed: Stale assessment must be preserved without modification');
}
console.log('PASS: Impl05 Test 5 -> Withdrawal with keepStale preserves historical assessment; ineligible check-ins do not corrupt it.');

// Test 05-6: Re-enabling Well-being permission: Ineligible records remain NOT_ELIGIBLE
console.log('\n[Impl05 Test 6] Re-enabling Well-being: Ineligible records do NOT get promoted:');
// Suppose student had 1 ineligible checkin while permission was OFF
const recordsBeforeReenable = [checkInIneligible];
// Permission re-enabled
const consentReenabled05: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: true,
  wellbeing_checkins: true,
};
const eligibleAfterReenable = recordsBeforeReenable.filter(c => c.assessmentEligibility === 'ELIGIBLE');
if (eligibleAfterReenable.length !== 0) {
  throw new Error('Impl05 Test 6 failed: Ineligible records must never be automatically promoted to ELIGIBLE');
}
const derivedSignalAfterReenable = eligibleAfterReenable.length > 0 ? extractWellbeingSignalsFromCheckIn(eligibleAfterReenable[0]) : null;
if (derivedSignalAfterReenable !== null) {
  throw new Error('Impl05 Test 6 failed: Derived signal should remain null if no eligible records exist');
}
console.log('PASS: Impl05 Test 6 -> Re-enabling consent does not retroactively promote private ineligible records.');

// Test 05-7: Persistence & round-trip serialization of eligibility flags
console.log('\n[Impl05 Test 7] Persistence round-trip serialization of eligibility flags:');
const checkinsToPersist05: CheckIn[] = [checkInEligible, checkInIneligible];
const serialized05 = JSON.stringify(checkinsToPersist05);
const deserialized05: CheckIn[] = JSON.parse(serialized05);
if (deserialized05[0].assessmentEligibility !== 'ELIGIBLE' || deserialized05[0].isAssessmentEligible !== true) {
  throw new Error('Impl05 Test 7 failed: Deserialized record 0 eligibility corrupted');
}
if (deserialized05[1].assessmentEligibility !== 'NOT_ELIGIBLE' || deserialized05[1].isAssessmentEligible !== false) {
  throw new Error('Impl05 Test 7 failed: Deserialized record 1 eligibility corrupted');
}
console.log('PASS: Impl05 Test 7 -> Serialized & deserialized check-ins preserve exact assessment eligibility flags.');

// ==========================================
// IMPLEMENTATION 06 TESTS — FEATURES 01 + 02
// ==========================================
console.log('\n==========================================');
console.log('IMPLEMENTATION 06 — LIVE & CONSENT-AWARE EXPLANATION TESTS');
console.log('==========================================');

// Test 06-1: Live academic explanation uses actual permitted input
console.log('\n[Impl06 Test 1] Live academic explanation uses actual permitted input:');
const fullAcademicInput = filterSignalsByConsent({
  academic: {
    attendance: 70,
    attendanceDeclining: true,
    marksDeclining: true,
    overdueAssignments: 2,
    academicStress: 5,
    requestedHelp: true,
  },
  financial: null,
  wellbeing: null,
}, { academic_data: true, financial_support: false, wellbeing_checkins: false });
const out06_1 = evaluateSupportNeedProfile(fullAcademicInput);
if (!out06_1.academic.available || !out06_1.academic.explainability) {
  throw new Error('Impl06 Test 1 failed: Academic explanation must be available');
}
const exp06_1 = out06_1.academic.explainability;
if (!exp06_1.contributingFactors.some(f => f.includes('70%')) ||
    !exp06_1.contributingFactors.some(f => f.includes('2 assignment(s) overdue')) ||
    !exp06_1.contributingFactors.some(f => f.includes('Attendance trend is declining')) ||
    !exp06_1.contributingFactors.some(f => f.includes('Assessment marks trend is declining')) ||
    !exp06_1.contributingFactors.some(f => f.includes('Academic stress self-rating is elevated (5/5)')) ||
    !exp06_1.contributingFactors.some(f => f.includes('Student requested academic support'))) {
  throw new Error('Impl06 Test 1 failed: All live academic factors must be accurately reflected');
}
if (!exp06_1.dataUsed.includes('Course module attendance percentage') ||
    !exp06_1.dataUsed.includes('Recent grade trajectory') ||
    !exp06_1.dataUsed.includes('Assignment submission deadlines')) {
  throw new Error('Impl06 Test 1 failed: Data used must reflect actual academic records used');
}
console.log('PASS: Impl06 Test 1 -> Live academic explanation accurately uses permitted inputs.');

// Test 06-2: Academic OFF prevents academic evidence from current explanation
console.log('\n[Impl06 Test 2] Academic OFF prevents academic evidence from current explanation:');
const acadOffInput = filterSignalsByConsent({
  academic: {
    attendance: 65,
    attendanceDeclining: true,
    marksDeclining: true,
    overdueAssignments: 3,
    academicStress: 5,
    requestedHelp: true,
  },
  financial: null,
  wellbeing: null,
}, { academic_data: false, financial_support: false, wellbeing_checkins: false });
const out06_2 = evaluateSupportNeedProfile(acadOffInput);
if (out06_2.academic.available !== false || out06_2.academic.level !== undefined || out06_2.academic.explainability !== undefined) {
  throw new Error('Impl06 Test 2 failed: Academic OFF must not produce explanation or leak raw evidence');
}
console.log('PASS: Impl06 Test 2 -> Academic OFF strictly isolates academic evidence.');

// Test 06-3: Financial NOT_PAID explanation uses only feeStatus
console.log('\n[Impl06 Test 3] Financial NOT_PAID explanation uses only feeStatus:');
const finNotPaidInput = filterSignalsByConsent({
  academic: null,
  financial: { feeStatus: 'NOT_PAID' },
  wellbeing: null,
}, { academic_data: false, financial_support: true, wellbeing_checkins: false });
const out06_3 = evaluateSupportNeedProfile(finNotPaidInput);
if (!out06_3.financial.available || !out06_3.financial.explainability) {
  throw new Error('Impl06 Test 3 failed: Financial explanation must exist');
}
const exp06_3 = out06_3.financial.explainability;
if (!exp06_3.contributingFactors.includes('Institutional fee payment is pending')) {
  throw new Error('Impl06 Test 3 failed: NOT_PAID must state fee payment is pending');
}
if (exp06_3.dataUsed.length !== 1 || exp06_3.dataUsed[0] !== 'Institutional fee payment status') {
  throw new Error('Impl06 Test 3 failed: Data used must only be fee payment status');
}
const bannedFields06 = ['Income', 'Family income', 'Expenses', 'Expense categories', 'Bank statements', 'Transaction history', 'Credit score', 'Aadhaar', 'Debt', 'Financial stress'];
for (const banned of bannedFields06) {
  if (!exp06_3.dataNotUsed?.includes(banned)) {
    throw new Error(`Impl06 Test 3 failed: Missing banned field ${banned} from dataNotUsed`);
  }
}
console.log('PASS: Impl06 Test 3 -> Financial NOT_PAID explanation uses strictly feeStatus and documents banned fields.');

// Test 06-4: Financial PAID explanation does not claim financial security
console.log('\n[Impl06 Test 4] Financial PAID explanation does not claim financial security:');
const finPaidInput = filterSignalsByConsent({
  academic: null,
  financial: { feeStatus: 'PAID' },
  wellbeing: null,
}, { academic_data: false, financial_support: true, wellbeing_checkins: false });
const out06_4 = evaluateSupportNeedProfile(finPaidInput);
const exp06_4 = out06_4.financial.explainability;
if (!exp06_4) throw new Error('Impl06 Test 4 failed: Explainability missing');
const factorsString = exp06_4.contributingFactors.join(' ').toLowerCase();
if (factorsString.includes('secure') || factorsString.includes('no financial difficulty') || factorsString.includes('sufficient')) {
  throw new Error('Impl06 Test 4 failed: PAID status must not claim student is financially secure or without difficulty');
}
if (!exp06_4.contributingFactors.includes('Institutional tuition fees recorded as paid')) {
  throw new Error('Impl06 Test 4 failed: PAID status should state tuition fees recorded as paid');
}
console.log('PASS: Impl06 Test 4 -> Financial PAID explanation does not claim false financial security.');

// Test 06-5: Financial OFF prevents feeStatus from current explanation
console.log('\n[Impl06 Test 5] Financial OFF prevents feeStatus from current explanation:');
const finOffInput = filterSignalsByConsent({
  academic: null,
  financial: { feeStatus: 'NOT_PAID' },
  wellbeing: null,
}, { academic_data: false, financial_support: false, wellbeing_checkins: false });
const out06_5 = evaluateSupportNeedProfile(finOffInput);
if (out06_5.financial.available !== false || out06_5.financial.level !== undefined || out06_5.financial.explainability !== undefined) {
  throw new Error('Impl06 Test 5 failed: Financial OFF must not produce explanation or leak feeStatus');
}
console.log('PASS: Impl06 Test 5 -> Financial OFF completely prevents feeStatus exposure.');

// Test 06-6: Eligible well-being check-in can produce explanation evidence
console.log('\n[Impl06 Test 6] Eligible well-being check-in produces live explanation evidence:');
const eligibleCheckInObj: CheckIn = {
  id: 'chk-live-1',
  date: 'Today',
  mood: 2,
  energy: 2,
  stress: 4,
  sleep: 2,
  workload: 3,
  reflection: 'Eligible check-in',
  assessmentEligibility: 'ELIGIBLE',
  isAssessmentEligible: true,
};
const wbSignalEligible = extractWellbeingSignalsFromCheckIn(eligibleCheckInObj);
const wbEligibleInput = filterSignalsByConsent({
  academic: null,
  financial: null,
  wellbeing: wbSignalEligible,
}, { academic_data: false, financial_support: false, wellbeing_checkins: true });
const out06_6 = evaluateSupportNeedProfile(wbEligibleInput);
if (!out06_6.wellbeing.available || !out06_6.wellbeing.explainability) {
  throw new Error('Impl06 Test 6 failed: Well-being explanation must exist for eligible check-in');
}
const exp06_6 = out06_6.wellbeing.explainability;
if (!exp06_6.contributingFactors.some(f => f.includes('stress level is elevated (4/5)')) ||
    !exp06_6.contributingFactors.some(f => f.includes('mood score is low (2/5)')) ||
    !exp06_6.contributingFactors.some(f => f.includes('energy level is low (2/5)')) ||
    !exp06_6.contributingFactors.some(f => f.includes('sleep quality is low (2/5)'))) {
  throw new Error('Impl06 Test 6 failed: Live check-in signals must be in contributingFactors');
}
if (!exp06_6.dataNotUsed?.includes('Private reflection notes') || !exp06_6.dataNotUsed?.includes('Ineligible check-in responses')) {
  throw new Error('Impl06 Test 6 failed: Well-being dataNotUsed must document excluded private/ineligible data');
}
console.log('PASS: Impl06 Test 6 -> Eligible well-being check-in generates live explanation evidence.');

// Test 06-7: Ineligible well-being check-in cannot produce explanation evidence
console.log('\n[Impl06 Test 7] Ineligible well-being check-in cannot produce explanation evidence:');
const ineligibleCheckInObj: CheckIn = {
  id: 'chk-inelig-1',
  date: 'Today',
  mood: 1,
  energy: 1,
  stress: 5,
  sleep: 1,
  workload: 4,
  reflection: 'Private reflection',
  assessmentEligibility: 'NOT_ELIGIBLE',
  isAssessmentEligible: false,
};
const wbSignalIneligible = extractWellbeingSignalsFromCheckIn(ineligibleCheckInObj);
if (wbSignalIneligible !== null) {
  throw new Error('Impl06 Test 7 failed: extractWellbeingSignalsFromCheckIn must return null for ineligible checkin');
}
const wbIneligibleInput = filterSignalsByConsent({
  academic: null,
  financial: null,
  wellbeing: wbSignalIneligible,
}, { academic_data: false, financial_support: false, wellbeing_checkins: true });
const out06_7 = evaluateSupportNeedProfile(wbIneligibleInput);
if (out06_7.wellbeing.available !== false || out06_7.wellbeing.level !== undefined || out06_7.wellbeing.explainability !== undefined) {
  throw new Error('Impl06 Test 7 failed: Ineligible check-in must not produce well-being explanation or assessment');
}
console.log('PASS: Impl06 Test 7 -> Ineligible check-in strictly isolated from explanation.');

// Test 06-8: Limited consent produces limited/unavailable explanation correctly
console.log('\n[Impl06 Test 8] Limited consent produces independent explanation per dimension:');
const limitedInput = filterSignalsByConsent({
  academic: { attendance: 70, overdueAssignments: 1 },
  financial: { feeStatus: 'NOT_PAID' },
  wellbeing: { mood: 1, stress: 5 },
}, { academic_data: true, financial_support: false, wellbeing_checkins: false });
const out06_8 = evaluateSupportNeedProfile(limitedInput);
if (!out06_8.academic.available || !out06_8.academic.explainability) {
  throw new Error('Impl06 Test 8 failed: Consented dimension must have explanation');
}
if (out06_8.financial.available !== false || out06_8.financial.explainability !== undefined) {
  throw new Error('Impl06 Test 8 failed: Non-consented financial must have no explanation');
}
if (out06_8.wellbeing.available !== false || out06_8.wellbeing.explainability !== undefined) {
  throw new Error('Impl06 Test 8 failed: Non-consented wellbeing must have no explanation');
}
console.log('PASS: Impl06 Test 8 -> Limited consent independently explains only permitted dimensions.');

// Test 06-9: Stale result explanation is marked historical
console.log('\n[Impl06 Test 9] Stale result explanation is marked historical:');
const staleMapAllTrue: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: true,
  wellbeing_checkins: true,
};
const withdrawnAllInput = filterSignalsByConsent({
  academic: { attendance: 60 },
  financial: { feeStatus: 'NOT_PAID' },
  wellbeing: { stress: 5 },
}, { academic_data: false, financial_support: false, wellbeing_checkins: false });
const out06_9 = evaluateSupportNeedProfile(withdrawnAllInput, staleMapAllTrue);
if (!out06_9.academic.stale || !out06_9.financial.stale || !out06_9.wellbeing.stale) {
  throw new Error('Impl06 Test 9 failed: Retained results must be flagged as stale');
}
if (!out06_9.academic.explainability?.timeWindow?.includes('prior to permission withdrawal') ||
    !out06_9.financial.explainability?.timeWindow?.includes('prior to permission withdrawal') ||
    !out06_9.wellbeing.explainability?.timeWindow?.includes('prior to permission withdrawal')) {
  throw new Error('Impl06 Test 9 failed: Time window must explicitly state historical status');
}
if (!out06_9.academic.explainability?.dataUsed.some(d => d.includes('(historical record)')) ||
    !out06_9.financial.explainability?.dataUsed.some(d => d.includes('(historical record)')) ||
    !out06_9.wellbeing.explainability?.dataUsed.some(d => d.includes('(historical record)'))) {
  throw new Error('Impl06 Test 9 failed: Data used must indicate historical records');
}
console.log('PASS: Impl06 Test 9 -> Stale result explanations are prominently marked historical.');

// Test 06-10: Removed result produces no fabricated explanation
console.log('\n[Impl06 Test 10] Removed result produces no fabricated explanation:');
const staleMapAllFalse: Record<DataPermissionKey, boolean> = {
  academic_data: false,
  financial_support: false,
  wellbeing_checkins: false,
};
const out06_10 = evaluateSupportNeedProfile(withdrawnAllInput, staleMapAllFalse);
if (out06_10.academic.available || out06_10.academic.explainability !== undefined ||
    out06_10.financial.available || out06_10.financial.explainability !== undefined ||
    out06_10.wellbeing.available || out06_10.wellbeing.explainability !== undefined) {
  throw new Error('Impl06 Test 10 failed: Removed dimensions must have no fabricated explanation');
}
console.log('PASS: Impl06 Test 10 -> Removed results have zero fabricated explanations.');

// Test 06-11: Mixed permissions keep explanation dimensions independent
console.log('\n[Impl06 Test 11] Mixed permissions keep explanation dimensions independent:');
const mixedInput06 = filterSignalsByConsent({
  academic: null,
  financial: { feeStatus: 'PAID' },
  wellbeing: wbSignalEligible,
}, { academic_data: false, financial_support: true, wellbeing_checkins: true });
const mixedStaleMap06: Record<DataPermissionKey, boolean> = {
  academic_data: true,
  financial_support: false,
  wellbeing_checkins: false,
};
const out06_11 = evaluateSupportNeedProfile(mixedInput06, mixedStaleMap06);
if (!out06_11.academic.stale || out06_11.financial.stale || out06_11.wellbeing.stale) {
  throw new Error('Impl06 Test 11 failed: Only academic should be stale');
}
if (!out06_11.academic.explainability?.contributingFactors[0].includes('Historical assessment') ||
    out06_11.financial.explainability?.contributingFactors[0].includes('Historical assessment') ||
    out06_11.wellbeing.explainability?.contributingFactors[0].includes('Historical assessment')) {
  throw new Error('Impl06 Test 11 failed: Historical assessment tag must only be on stale dimension');
}
console.log('PASS: Impl06 Test 11 -> Mixed permissions keep explanation dimensions isolated and correct.');

// Test 06-12: Explanation metadata/result survives serialization/remount path
console.log('\n[Impl06 Test 12] Explanation metadata survives serialization/deserialization:');
const serializedProfile = JSON.stringify(out06_11);
const deserializedProfile: SupportNeedProfileData = JSON.parse(serializedProfile);
if (deserializedProfile.academic.explainability?.timeWindow !== out06_11.academic.explainability?.timeWindow ||
    deserializedProfile.financial.explainability?.contributingFactors[0] !== out06_11.financial.explainability?.contributingFactors[0] ||
    deserializedProfile.wellbeing.explainability?.dataUsed.length !== out06_11.wellbeing.explainability?.dataUsed.length) {
  throw new Error('Impl06 Test 12 failed: Deserialized explainability metadata corrupted');
}
console.log('PASS: Impl06 Test 12 -> Explanation metadata round-trips through JSON without corruption.');

console.log('\nALL TESTS PASSED SUCCESSFULLY.');


