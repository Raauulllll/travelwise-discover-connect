export function PriceGauge({ value, verdict }: { value: number; verdict: "now" | "watch" | "wait" }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 70;
  const circumference = Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  const label =
    verdict === "now" ? "Travel now" : verdict === "watch" ? "Watch a few days" : "Travel later";
  const stroke =
    verdict === "now" ? "var(--color-eco)" : verdict === "watch" ? "var(--color-marigold)" : "var(--color-destructive)";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 100" className="w-full max-w-[220px]" role="img" aria-label={label}>
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <text
          x="90"
          y="78"
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: 26, fontWeight: 800 }}
        >
          {clamped}
        </text>
      </svg>
      <p className="-mt-1 text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">Price index vs 12-month average</p>
    </div>
  );
}
