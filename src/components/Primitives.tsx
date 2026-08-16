export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "amber" | "moss" | "danger";
}) {
  const toneClass = {
    default: "text-ink",
    amber: "text-amber",
    moss: "text-moss",
    danger: "text-danger",
  }[tone];

  return (
    <div className="panel px-4 py-3.5">
      <div className="label-eyebrow">{label}</div>
      <div className={`mt-1.5 text-2xl font-semibold font-mono ${toneClass}`}>{value}</div>
      {sub && <div className="text-[11px] text-inkMuted mt-1">{sub}</div>}
    </div>
  );
}

export function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = value >= 0.75 ? "moss" : value >= 0.5 ? "amber" : "danger";
  const toneClasses = {
    moss: "bg-moss/15 text-moss border-moss/30",
    amber: "bg-amber/15 text-amber border-amber/30",
    danger: "bg-danger/15 text-danger border-danger/30",
  }[tone];

  return (
    <span className={`inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded border ${toneClasses}`}>
      {pct}%
    </span>
  );
}

const THUMB_TONES: Record<string, string> = {
  amber: "bg-amber/25 border-amber/40",
  moss: "bg-moss/25 border-moss/40",
  signal: "bg-signal/25 border-signal/40",
};

// Stands in for an actual camera-trap frame — the real build renders the
// decoded JPEG here. Kept as a labelled color block so the UI never
// implies a real photograph that wasn't captured in the field.
export function ThumbPlaceholder({
  tone,
  label,
  size = "md",
}: {
  tone: string;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: "w-14 h-14", md: "w-20 h-20", lg: "w-full h-40" }[size];
  return (
    <div
      className={`${dims} ${THUMB_TONES[tone] ?? THUMB_TONES.amber} border rounded flex items-center justify-center stripe-field shrink-0`}
    >
      <span className="text-[9px] font-mono text-inkMuted text-center px-1">{label}</span>
    </div>
  );
}
