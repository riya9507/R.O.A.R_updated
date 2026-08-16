import { Screen } from "../types";

const NAV: { id: Screen; label: string; caption: string }[] = [
  { id: "dashboard", label: "Dashboard", caption: "Reserve overview" },
  { id: "analysis", label: "AI Analysis", caption: "Tiger image identification" },
  { id: "map", label: "Tiger Map", caption: "GPS observations and ranges" },
  { id: "cameras", label: "Camera Traps", caption: "Images and stations" },
  { id: "reports", label: "Reports", caption: "Tiger analytics" },
  { id: "alerts", label: "Alerts", caption: "Officer attention queue" },
];

export default function Sidebar({ active, onSelect, pendingReview, activeAlerts }: {
  active: Screen;
  onSelect: (s: Screen) => void;
  pendingReview: number;
  activeAlerts: number;
}) {
  const badgeFor = (id: Screen) => id === "alerts" ? activeAlerts : id === "analysis" ? pendingReview : null;
  return (
    <aside className="w-60 shrink-0 bg-panel border-r border-border flex flex-col">
      <div className="px-5 py-5 border-b border-border stripe-field">
        <div className="text-[10px] tracking-[0.18em] uppercase text-inkFaint">Pench Tiger Reserve</div>
        <div className="mt-1 text-xl font-semibold tracking-tight">R.O.A.R</div>
        <div className="text-[11px] text-inkMuted mt-0.5"> Robust Offline Analytics &<br/>Re-identification</div>
      </div>
      <nav className="flex-1 py-3">
        {NAV.map((item) => {
          const isActive = item.id === active;
          const badge = badgeFor(item.id);
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} className={`w-full text-left px-5 py-3 border-l-2 transition-colors ${isActive ? "border-amber bg-panelAlt" : "border-transparent hover:bg-panelAlt/60"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] font-medium ${isActive ? "text-ink" : "text-inkMuted"}`}>{item.label}</span>
                {badge !== null && badge > 0 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">{badge}</span>}
              </div>
              <div className="text-[10.5px] text-inkFaint mt-0.5">{item.caption}</div>
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <div className="label-eyebrow">System status</div>
        <div className="flex items-center gap-1.5 mt-1.5"><span className="w-1.5 h-1.5 rounded-full bg-moss" /><span className="text-[11px] text-inkMuted">Offline mode · local processing</span></div>
      </div>
    </aside>
  );
}
