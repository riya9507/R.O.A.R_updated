import { useState } from "react";
import { ConfidenceBadge, ThumbPlaceholder } from "../components/Primitives";
import { reviewQueue as initialQueue } from "../data/mockData";
import { ReviewItem } from "../types";

export default function ReviewQueueScreen() {
  const [queue, setQueue] = useState<ReviewItem[]>(initialQueue);

  function resolve(id: string, status: ReviewItem["status"]) {
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  const pending = queue.filter((q) => q.status === "pending");
  const resolved = queue.filter((q) => q.status !== "pending");

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h2 className="text-[13.5px] font-semibold">Ambiguous matches</h2>
        <p className="text-[11.5px] text-inkMuted mt-1">
          Confident matches were applied automatically and are already in the database.
          Only frames the system could not confidently resolve appear here.
        </p>
      </div>

      <div className="space-y-3">
        {pending.length === 0 && (
          <div className="panel p-8 text-center text-[12px] text-inkMuted stripe-field">
            Queue is clear — nothing awaiting review.
          </div>
        )}
        {pending.map((item) => (
          <div key={item.id} className="panel p-4">
            <div className="flex gap-4">
              <div>
                <ThumbPlaceholder tone={item.captureThumbnail} label="new capture" size="md" />
                <div className="text-[10.5px] font-mono text-inkFaint mt-1.5 text-center">
                  {item.stationId}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-inkMuted font-mono">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                {item.candidates.length > 0 ? (
                  <div className="mt-2.5 flex gap-3">
                    {item.candidates.map((c) => (
                      <div
                        key={c.tigerId}
                        className="flex items-center gap-2.5 border border-border rounded px-2.5 py-2 bg-panelAlt"
                      >
                        <ThumbPlaceholder tone={c.refThumbnail} label="catalogue" size="sm" />
                        <div>
                          <div className="font-mono text-[12px]">{c.tigerId}</div>
                          <ConfidenceBadge value={c.confidence} />
                        </div>
                        <button
                          onClick={() => resolve(item.id, "confirmed")}
                          className="ml-2 text-[11px] px-2 py-1 rounded bg-moss/15 text-moss border border-moss/30 hover:bg-moss/25 transition-colors"
                        >
                          Confirm match
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2.5 text-[11.5px] text-inkMuted">
                    No catalogue match found — likely a new individual.
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => resolve(item.id, "new-individual")}
                    className="text-[11px] px-2.5 py-1 rounded border border-border text-inkMuted hover:text-ink hover:border-signal/40 transition-colors"
                  >
                    Enroll as new individual
                  </button>
                  <button
                    onClick={() => resolve(item.id, "rejected")}
                    className="text-[11px] px-2.5 py-1 rounded border border-border text-inkMuted hover:text-danger hover:border-danger/40 transition-colors"
                  >
                    Not a tiger / reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resolved.length > 0 && (
        <div>
          <div className="label-eyebrow mb-2">Resolved this session</div>
          <div className="space-y-1.5">
            {resolved.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 panel text-[11.5px]"
              >
                <span className="font-mono text-inkMuted">{item.stationId}</span>
                <span className="text-inkMuted capitalize">{item.status.replace("-", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
