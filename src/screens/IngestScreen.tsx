import { useState } from "react";
import { StatCard, ThumbPlaceholder } from "../components/Primitives";
import { lastRun, reviewQueue } from "../data/mockData";

type RunState = "idle" | "selecting" | "running" | "done";

export default function IngestScreen() {
  const [folder, setFolder] = useState<string | null>(null);
  const [state, setState] = useState<RunState>("idle");
  const [progress, setProgress] = useState(0);

  async function handleSelectFolder() {
    setState("selecting");
    // Falls back to a sample path when not running inside Electron
    // (e.g. previewing the renderer in a plain browser during dev).
    const path = window.roar
      ? await window.roar.selectIngestFolder()
      : "/media/SD_CARD_07/DCIM";
    if (!path) {
      setState("idle");
      return;
    }
    setFolder(path);
    setState("running");
    let p = 0;
    const timer = setInterval(() => {
      p += 8 + Math.random() * 10;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setState("done");
      }
      setProgress(Math.round(p));
    }, 220);
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="panel p-5">
        <div className="label-eyebrow">Step 1</div>
        <h2 className="text-[15px] font-semibold mt-1">Select raw camera trap folder</h2>
        <p className="text-[12px] text-inkMuted mt-1 max-w-xl">
          Point directly at the SD card dump. No pre-sorting, renaming, or folder structure
          is assumed — mixed cameras, reset clocks, and inconsistent naming are handled
          during pre-processing.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSelectFolder}
            disabled={state === "running"}
            className="px-4 py-2 rounded bg-amber text-bg text-[12.5px] font-medium hover:bg-amber/90 disabled:opacity-50 transition-colors"
          >
            {folder ? "Change folder" : "Choose folder"}
          </button>
          {folder && <span className="font-mono text-[12px] text-inkMuted">{folder}</span>}
        </div>

        {state === "running" && (
          <div className="mt-5">
            <div className="flex justify-between text-[11px] text-inkMuted mb-1.5">
              <span>Pre-processing → filtering → detection → identification</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="h-1.5 bg-panelAlt rounded-full overflow-hidden">
              <div
                className="h-full bg-amber transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {state === "done" && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Images ingested" value={lastRun.totalImages.toLocaleString()} />
            <StatCard
              label="Blanks removed"
              value={lastRun.blanksRemoved.toLocaleString()}
              sub={`${((lastRun.blanksRemoved / lastRun.totalImages) * 100).toFixed(1)}% of intake`}
              tone="moss"
            />
            <StatCard
              label="Quarantined"
              value={lastRun.quarantined.toLocaleString()}
              sub="below confidence threshold"
              tone="amber"
            />
            <StatCard
              label="Time saved"
              value={`${lastRun.timeSavedHrs} hrs`}
              sub={`${lastRun.spaceSavedGb} GB freed`}
            />
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13.5px] font-semibold">Quarantine queue</h3>
                <p className="text-[11.5px] text-inkMuted mt-0.5">
                  Frames below the confidence threshold are staged here, never deleted.
                  Review and confirm before they're cleared.
                </p>
              </div>
              <button className="px-3 py-1.5 rounded border border-border text-[11.5px] text-inkMuted hover:text-ink hover:border-amber/40 transition-colors">
                Open quarantine ({lastRun.quarantined.toLocaleString()})
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              {["amber", "moss", "signal", "amber"].map((t, i) => (
                <ThumbPlaceholder key={i} tone={t} label="staged" size="sm" />
              ))}
              <div className="w-14 h-14 border border-dashed border-border rounded flex items-center justify-center text-[10px] text-inkFaint">
                +{(lastRun.quarantined - 4).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13.5px] font-semibold">Identification summary</h3>
                <p className="text-[11.5px] text-inkMuted mt-0.5">
                  {lastRun.newIndividuals} new individual enrolled automatically ·{" "}
                  {reviewQueue.length} ambiguous matches await review
                </p>
              </div>
              <span className="font-mono text-[11px] text-amber">
                {reviewQueue.length} pending
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
