import type { CheckIn, AcademicMetric, Deadline } from '../types';
import type { ExtractedSignal, SignalCategory, SignalPolarity, SignalSeverity } from './types';

/**
 * Normalizes and extracts structured signals from raw check-in data and academic context.
 */
export function extractSignals(
  latestCheckIn?: CheckIn | null,
  recentCheckIns: CheckIn[] = [],
  academicMetrics: AcademicMetric[] = [],
  deadlines: Deadline[] = []
): ExtractedSignal[] {
  if (!latestCheckIn) {
    return [];
  }

  const signals: ExtractedSignal[] = [];

  // 1. Sleep Signal
  const sleepVal = Number(latestCheckIn.sleep) || 3;
  let sleepPolarity: SignalPolarity = 'neutral';
  let sleepSeverity: SignalSeverity = 'mild';
  let sleepScore = 0.5;
  let sleepLabel = `Sleep rated ${sleepVal} / 5`;
  let sleepContext = 'Sleep is within a typical neutral band.';

  if (sleepVal <= 2) {
    sleepPolarity = 'strain';
    sleepSeverity = sleepVal === 1 ? 'severe' : 'elevated';
    sleepScore = sleepVal === 1 ? 0.95 : 0.75;
    sleepLabel = `Sleep rated ${sleepVal} / 5 (${sleepVal === 1 ? 'poor' : 'low'})`;
    sleepContext = 'Recent rest has been shorter or less restorative than usual.';
  } else if (sleepVal >= 4) {
    sleepPolarity = 'vitality';
    sleepSeverity = 'mild';
    sleepScore = sleepVal === 5 ? 0.9 : 0.75;
    sleepLabel = `Sleep rated ${sleepVal} / 5 (${sleepVal === 5 ? 'restorative' : 'good'})`;
    sleepContext = 'Rest has been consistent and supportive.';
  }

  signals.push({
    id: 'sig-sleep',
    category: 'sleep',
    name: 'sleep_status',
    label: sleepLabel,
    rawValue: sleepVal,
    normalizedScore: sleepScore,
    polarity: sleepPolarity,
    severity: sleepSeverity,
    weight: 0.8,
    confidence: 0.9,
    contextStatement: sleepContext,
  });

  // 2. Energy Signal
  const energyVal = Number(latestCheckIn.energy) || 3;
  let energyPolarity: SignalPolarity = 'neutral';
  let energySeverity: SignalSeverity = 'mild';
  let energyScore = 0.5;
  let energyLabel = `Energy rated ${energyVal} / 5`;
  let energyContext = 'Energy feels moderate and steady.';

  if (energyVal <= 2) {
    energyPolarity = 'strain';
    energySeverity = energyVal === 1 ? 'severe' : 'elevated';
    energyScore = energyVal === 1 ? 0.95 : 0.75;
    energyLabel = `Energy rated ${energyVal} / 5 (${energyVal === 1 ? 'drained' : 'low'})`;
    energyContext = 'Available physical or mental reserves feel constrained.';
  } else if (energyVal >= 4) {
    energyPolarity = 'vitality';
    energySeverity = 'mild';
    energyScore = energyVal === 5 ? 0.9 : 0.75;
    energyLabel = `Energy rated ${energyVal} / 5 (${energyVal === 5 ? 'high' : 'good'})`;
    energyContext = 'Energy reserves feel available for focused work.';
  }

  signals.push({
    id: 'sig-energy',
    category: 'energy',
    name: 'energy_reserves',
    label: energyLabel,
    rawValue: energyVal,
    normalizedScore: energyScore,
    polarity: energyPolarity,
    severity: energySeverity,
    weight: 0.85,
    confidence: 0.9,
    contextStatement: energyContext,
  });

  // 3. Stress Signal
  const stressVal = Number(latestCheckIn.stress) || 3;
  let stressPolarity: SignalPolarity = 'neutral';
  let stressSeverity: SignalSeverity = 'mild';
  let stressScore = 0.5;
  let stressLabel = `Stress rated ${stressVal} / 5`;
  let stressContext = 'Stress is present but at a manageable level.';

  if (stressVal >= 4) {
    stressPolarity = 'strain';
    stressSeverity = stressVal === 5 ? 'severe' : 'elevated';
    stressScore = stressVal === 5 ? 0.95 : 0.8;
    stressLabel = `Stress rated ${stressVal} / 5 (${stressVal === 5 ? 'loud' : 'high'})`;
    stressContext = 'Pressure is taking up significant mental attention.';
  } else if (stressVal <= 2) {
    stressPolarity = 'vitality';
    stressSeverity = 'mild';
    stressScore = stressVal === 1 ? 0.9 : 0.75;
    stressLabel = `Stress rated ${stressVal} / 5 (quiet)`;
    stressContext = 'Cognitive pressure is currently low and calm.';
  }

  signals.push({
    id: 'sig-stress',
    category: 'stress',
    name: 'stress_pressure',
    label: stressLabel,
    rawValue: stressVal,
    normalizedScore: stressScore,
    polarity: stressPolarity,
    severity: stressSeverity,
    weight: 0.85,
    confidence: 0.9,
    contextStatement: stressContext,
  });

  // 4. Workload Signal
  const workloadVal = Number(latestCheckIn.workload) || 3;
  let workloadPolarity: SignalPolarity = 'neutral';
  let workloadSeverity: SignalSeverity = 'mild';
  let workloadScore = 0.5;
  let workloadLabel = `Workload rated ${workloadVal} / 5`;
  let workloadContext = 'Academic obligations feel manageable.';

  if (workloadVal >= 4) {
    workloadPolarity = 'strain';
    workloadSeverity = workloadVal === 5 ? 'severe' : 'elevated';
    workloadScore = workloadVal === 5 ? 0.95 : 0.8;
    workloadLabel = `Workload rated ${workloadVal} / 5 (${workloadVal === 5 ? 'heavy' : 'full'})`;
    workloadContext = 'Multiple academic deliverables are actively competing for time.';
  } else if (workloadVal <= 2) {
    workloadPolarity = 'vitality';
    workloadSeverity = 'mild';
    workloadScore = 0.7;
    workloadLabel = `Workload rated ${workloadVal} / 5 (light)`;
    workloadContext = 'Academic plate currently has generous breathing room.';
  }

  signals.push({
    id: 'sig-workload',
    category: 'workload',
    name: 'workload_volume',
    label: workloadLabel,
    rawValue: workloadVal,
    normalizedScore: workloadScore,
    polarity: workloadPolarity,
    severity: workloadSeverity,
    weight: 0.8,
    confidence: 0.9,
    contextStatement: workloadContext,
  });

  // 5. Mood Signal
  const moodVal = Number(latestCheckIn.mood) || 3;
  let moodPolarity: SignalPolarity = 'neutral';
  let moodSeverity: SignalSeverity = 'mild';
  let moodScore = 0.5;
  let moodLabel = `Mood rated ${moodVal} / 5`;
  let moodContext = 'Mood is steady.';

  if (moodVal <= 2) {
    moodPolarity = 'strain';
    moodSeverity = moodVal === 1 ? 'severe' : 'elevated';
    moodScore = moodVal === 1 ? 0.9 : 0.75;
    moodLabel = `Mood rated ${moodVal} / 5 (${moodVal === 1 ? 'rough' : 'low'})`;
    moodContext = 'Emotional state feels somewhat strained or fragile.';
  } else if (moodVal >= 4) {
    moodPolarity = 'vitality';
    moodSeverity = 'mild';
    moodScore = moodVal === 5 ? 0.95 : 0.8;
    moodLabel = `Mood rated ${moodVal} / 5 (${moodVal === 5 ? 'great' : 'positive'})`;
    moodContext = 'Emotional outlook is upbeat and resilient.';
  }

  signals.push({
    id: 'sig-mood',
    category: 'mood',
    name: 'mood_momentum',
    label: moodLabel,
    rawValue: moodVal,
    normalizedScore: moodScore,
    polarity: moodPolarity,
    severity: moodSeverity,
    weight: 0.75,
    confidence: 0.9,
    contextStatement: moodContext,
  });

  // 6. Reflection qualitative signal (if present)
  if (latestCheckIn.reflection && latestCheckIn.reflection.trim().length > 0) {
    const rawNote = latestCheckIn.reflection.trim();
    const truncatedNote = rawNote.length > 50 ? `${rawNote.slice(0, 48)}...` : rawNote;
    const lowerNote = rawNote.toLowerCase();

    let notePolarity: SignalPolarity = 'neutral';
    if (lowerNote.includes('deadline') || lowerNote.includes('stress') || lowerNote.includes('tired') || lowerNote.includes('heavy') || lowerNote.includes('critique') || lowerNote.includes('stretched') || lowerNote.includes('pressure')) {
      notePolarity = 'strain';
    } else if (lowerNote.includes('good') || lowerNote.includes('better') || lowerNote.includes('clear') || lowerNote.includes('excited') || lowerNote.includes('progress') || lowerNote.includes('done')) {
      notePolarity = 'vitality';
    }

    signals.push({
      id: 'sig-reflection',
      category: 'reflection',
      name: 'qualitative_reflection',
      label: `Note: "${truncatedNote}"`,
      rawValue: rawNote,
      normalizedScore: 0.7,
      polarity: notePolarity,
      severity: notePolarity === 'strain' ? 'moderate' : 'mild',
      weight: 0.65,
      confidence: 0.85,
      contextStatement: `Personal reflection note provided: "${truncatedNote}"`,
    });
  }

  // 7. Academic Context Signals (Deadlines & Anchor Subjects)
  const urgentDeadlines = deadlines.filter((d) => d.priority === 'high' || d.date.toLowerCase().includes('tomorrow') || d.date.toLowerCase().includes('today') || d.date.toLowerCase().includes('18h') || d.date.toLowerCase().includes('24h') || d.date.toLowerCase().includes('48h'));
  if (urgentDeadlines.length > 0) {
    signals.push({
      id: 'sig-academic-deadlines',
      category: 'academic_context',
      name: 'upcoming_deadlines',
      label: `${urgentDeadlines.length} deadline${urgentDeadlines.length > 1 ? 's' : ''} in 48 hours`,
      rawValue: urgentDeadlines.map((d) => d.title).join(', '),
      normalizedScore: 0.85,
      polarity: 'strain',
      severity: urgentDeadlines.length >= 2 ? 'elevated' : 'moderate',
      weight: 0.75,
      confidence: 0.95,
      contextStatement: `${urgentDeadlines.length} high-priority deadline(s) approaching (${urgentDeadlines[0].title}).`,
    });
  }

  // Anchor Subject Signal (High performance & attendance)
  const anchorSubject = academicMetrics.find((m) => m.score >= 80 && m.attendance >= 90);
  if (anchorSubject) {
    signals.push({
      id: 'sig-academic-anchor',
      category: 'academic_context',
      name: 'academic_anchor_subject',
      label: `${anchorSubject.subject} (${anchorSubject.score}% score)`,
      rawValue: anchorSubject.subject,
      normalizedScore: 0.85,
      polarity: 'vitality',
      severity: 'mild',
      weight: 0.7,
      confidence: 0.95,
      contextStatement: `Strong performance and consistency in ${anchorSubject.subject} (${anchorSubject.attendance}% attendance).`,
    });
  }

  return signals;
}
