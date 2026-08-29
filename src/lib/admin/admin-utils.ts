export function formatParityRatio(ratio: number): string {
  if (ratio >= 0.95 && ratio <= 1.05) return 'Optimal Parity';
  if (ratio < 0.95) return 'Under-represented';
  return 'Over-indexed';
}

export function generateAuditHash(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(32, '0')}`;
}

export function calculateDemographicParityDiscrepancy(
  cohortRate: number,
  baselineRate: number
): number {
  if (baselineRate === 0) return 0;
  return Number(((cohortRate - baselineRate) / baselineRate).toFixed(3));
}
