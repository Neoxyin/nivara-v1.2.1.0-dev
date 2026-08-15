interface RingProgressProps { value: number; label: string; }

export function RingProgress({ value, label }: RingProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeValue / 100);

  return (
    <div className="relative h-[112px] w-[112px] shrink-0" aria-label={`${value} ${label}`}>
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#292d29"
          strokeWidth="10"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#c3f340"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl">{value}</span>
        <span className="serenity-label text-[8px]">{label}</span>
      </div>
    </div>
  );
}
