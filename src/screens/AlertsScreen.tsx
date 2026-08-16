import { useState } from "react";
import { ConfidenceBadge } from "../components/Primitives";
import { alerts } from "../data/mockData";
import { AlertItem } from "../types";

const TYPE_LABEL: Record<AlertItem["type"], string> = {
  "centroid-shift": "Centroid shift",
  "new-station": "New station",
  "buffer-approach": "Buffer approach",
  "prolonged-absence": "Prolonged absence",
};

export default function AlertsScreen() {
  const [showArtefacts, setShowArtefacts] = useState(true);

  const visible = alerts.filter((a) => showArtefacts || !a.isSurveyArtefact);

  return (
    <div className="p-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13.5px] font-semibold">Deviation & trend alerts</h2>
          <p className="text-[11.5px] text-inkMuted mt-1">
            Compared against each individual's established history. Flagged artefacts of
            uneven survey effort are labelled, not hidden.
          </p>
        </div>
        <label className="flex items-center gap-2 text-[11.5px] text-inkMuted cursor-pointer">
          <input
            type="checkbox"
            checked={showArtefacts}
            onChange={(e) => setShowArtefacts(e.target.checked)}
            className="accent-amber"
          />
          Show survey-effort artefacts
        </label>
      </div>

      <div className="space-y-3">
        {visible.map((a) => (
          <div
            key={a.id}
            className={`panel p-4 border-l-2 ${
              a.isSurveyArtefact ? "border-l-inkFaint" : "border-l-danger"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] text-inkMuted">{a.tigerId}</span>
                  <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-panelAlt text-inkFaint border border-border">
                    {TYPE_LABEL[a.type]}
                  </span>
                  {a.isSurveyArtefact && (
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-signal/10 text-signal border border-signal/30">
                      Likely survey artefact
                    </span>
                  )}
                </div>
                <h3 className="text-[13px] font-medium mt-1.5">{a.title}</h3>
                <p className="text-[11.5px] text-inkMuted mt-1 leading-relaxed max-w-xl">
                  {a.evidence}
                </p>
              </div>
              <div className="text-right shrink-0">
                <ConfidenceBadge value={a.confidence} />
                <div className="text-[10.5px] font-mono text-inkFaint mt-1.5">{a.raisedOn}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
