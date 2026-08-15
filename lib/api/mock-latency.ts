/**
 * Optional latency simulator for the prototype API layer.
 *
 * Keep this at 0 for a responsive local demo. The real FastAPI/Supabase
 * integration will naturally provide real network latency later.
 * Set NEXT_PUBLIC_MOCK_LATENCY_MS to a positive number only when you want
 * to test loading states intentionally.
 */
const configured = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 0)
const MOCK_LATENCY_MS = Number.isFinite(configured) && configured > 0 ? configured : 0

export function pause(ms = MOCK_LATENCY_MS): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}
