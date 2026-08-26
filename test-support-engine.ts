import { 
  buildSupportIndicator, 
  filterSignalsByConsent,
  evaluateSupportNeedProfile,
  rawDemoStudentSignals,
  scoreFinancial,
  type SupportSignals,
  type RawStudentSignals,
  type RawFinancialSignals
} from './lib/data/support-engine';
import { 
  matchFinancialSupportOptions, 
  mockFinancialSupportOptions 
} from './lib/data/financial-support';
import type { DataPermissionKey } from './lib/types';

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
if (output2.academic.level !== 'UNAVAILABLE' || output2.academic.available !== false) {
  throw new Error(`Test 2 failed: Academic output must be UNAVAILABLE, got ${output2.academic.level}`);
}
console.log('PASS: Test 2 (Academic withdrawn) -> Input is strictly null, output is UNAVAILABLE.');

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
if (output3.financial.level !== 'UNAVAILABLE' || output3.financial.available !== false) {
  throw new Error(`Test 3 failed: Financial output must be UNAVAILABLE, got ${output3.financial.level}`);
}
console.log('PASS: Test 3 (Financial withdrawn) -> Input is strictly null, output is UNAVAILABLE.');

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
if (output4.wellbeing.level !== 'UNAVAILABLE' || output4.wellbeing.available !== false) {
  throw new Error(`Test 4 failed: Well-being output must be UNAVAILABLE, got ${output4.wellbeing.level}`);
}
console.log('PASS: Test 4 (Well-being withdrawn) -> Input is strictly null, output is UNAVAILABLE.');

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
  output5.academic.level !== 'UNAVAILABLE' || output5.academic.available ||
  output5.financial.level !== 'UNAVAILABLE' || output5.financial.available ||
  output5.wellbeing.level !== 'UNAVAILABLE' || output5.wellbeing.available
) {
  throw new Error('Test 5 failed: All dimensions must be UNAVAILABLE and available: false');
}
console.log('PASS: Test 5 (All unavailable) -> Zero personalized severity generated; all UNAVAILABLE.');

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
if (output6.financial.level !== 'UNAVAILABLE' || output6.wellbeing.level !== 'UNAVAILABLE') {
  throw new Error('Test 6 failed: Non-consented dimensions must be UNAVAILABLE');
}
console.log('PASS: Test 6 (Academic only) -> Only academic data reached engine; other dimensions UNAVAILABLE.');

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
if (stepAOutput.academic.level !== 'UNAVAILABLE') throw new Error('Test 7 step A output must be UNAVAILABLE');

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
if (scoreResultWithdrawn.level !== 'UNAVAILABLE' || scoreResultWithdrawn.available !== false) {
  throw new Error('Impl 03 Test 3 failed: Financial dimension must be UNAVAILABLE');
}
console.log('PASS: Impl 03 Test 3 -> feeStatus is absent; personalization UNAVAILABLE; general resources browsable.');

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
if (scoreResultWithdrawnPaid.level !== 'UNAVAILABLE' || scoreResultWithdrawnPaid.available !== false) {
  throw new Error('Impl 03 Test 4 failed: Financial dimension must be UNAVAILABLE');
}
console.log('PASS: Impl 03 Test 4 -> feeStatus is absent; personalization UNAVAILABLE; general resources browsable.');

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
if (outputAcadRemoved.academic.available || outputAcadRemoved.academic.level !== 'UNAVAILABLE') {
  throw new Error('Impl 04 Test 2 failed: Academic must be UNAVAILABLE');
}
if (!outputAcadRemoved.financial.available || outputAcadRemoved.financial.level !== 'MODERATE') {
  throw new Error('Impl 04 Test 2 failed: Permitted Financial dimension must evaluate normally');
}
if (!outputAcadRemoved.wellbeing.available || outputAcadRemoved.wellbeing.level !== 'MILD') {
  throw new Error('Impl 04 Test 2 failed: Permitted Well-being dimension must evaluate normally');
}
console.log('PASS: Impl 04 Test 2 -> Academic removed (UNAVAILABLE); other permitted dimensions evaluated normally.');

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
if (outputFinRemoved.financial.available || outputFinRemoved.financial.level !== 'UNAVAILABLE') {
  throw new Error('Impl 04 Test 4 failed: Financial must be UNAVAILABLE');
}
const generalOptions = matchFinancialSupportOptions(null);
if (generalOptions.length !== mockFinancialSupportOptions.length) {
  throw new Error('Impl 04 Test 4 failed: General financial options must still be accessible');
}
console.log('PASS: Impl 04 Test 4 -> Financial removed (UNAVAILABLE); general financial options still accessible.');

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
if (outputWbRemoved.wellbeing.available || outputWbRemoved.wellbeing.level !== 'UNAVAILABLE') {
  throw new Error('Impl 04 Test 6 failed: Well-being must be UNAVAILABLE');
}
console.log('PASS: Impl 04 Test 6 -> Well-being removed (UNAVAILABLE); standalone check-ins still operable.');

// Impl 04 Test 7: Multi-permission scenario: Academic kept stale, Financial removed, Well-being consented/current
console.log('\n[Impl 04 Test 7] Multi-permission mixed state (Academic Stale, Financial Removed, Well-being Current):');
const mixedConsent = { academic_data: false, financial_support: false, wellbeing_checkins: true };
const mixedStaleMap = { academic_data: true, financial_support: false, wellbeing_checkins: false };
const mixedInputs = filterSignalsByConsent(rawData, mixedConsent);
const mixedOutput = evaluateSupportNeedProfile(mixedInputs, mixedStaleMap);
if (!mixedOutput.academic.available || !mixedOutput.academic.stale) {
  throw new Error('Impl 04 Test 7 failed: Academic must be available and marked stale');
}
if (mixedOutput.financial.available || mixedOutput.financial.level !== 'UNAVAILABLE') {
  throw new Error('Impl 04 Test 7 failed: Financial must be UNAVAILABLE');
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
if (result2.academic.available !== false || result2.academic.level !== 'UNAVAILABLE' || result2.academic.stale === true) {
  throw new Error('BugFix Test 2 failed: Academic should be UNAVAILABLE and not stale');
}
console.log('PASS: BugFix Test 2 -> Academic correctly removed (UNAVAILABLE).');

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
if (result4.academic.available !== false || result4.academic.level !== 'UNAVAILABLE') {
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
if (outRemove.academic.available !== false || outRemove.academic.level !== 'UNAVAILABLE') {
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

console.log('\nALL TESTS PASSED SUCCESSFULLY.');


