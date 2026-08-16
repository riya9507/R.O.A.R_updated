import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { recentCaptures, tigers } from "../data/mockData";
import { ThumbPlaceholder } from "../components/Primitives";

// Synthetic per-run area trend for the detail chart — a real build reads
// this from the run history table in the local database.
function areaTrend(baseArea: number) {
  return Array.from({ length: 6 }).map((_, i) => ({
    run: `R${i + 1}`,
    area: +(baseArea * (0.82 + i * 0.035 + (i === 4 ? 0.02 : 0))).toFixed(1),
  }));
}

export default function TigerProfileScreen() {
  const [selectedId, setSelectedId] = useState(tigers[0].id);
  const selected = tigers.find((t) => t.id === selectedId)!;
  const captures = recentCaptures.filter((c) => c.tigerId === selectedId);

  return (
    <div className="p-6 flex gap-4 h-full">
      <div className="w-64 shrink-0 panel p-2 overflow-y-auto">
        <div className="label-eyebrow px-2 py-2">Catalogue · {tigers.length} individuals</div>
        {tigers.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`w-full text-left px-3 py-2.5 rounded transition-colors ${
              t.id === selectedId ? "bg-panelAlt" : "hover:bg-panelAlt/60"
            }`}
          >
            <div className="font-mono text-[12.5px]">{t.id}</div>
            <div className="text-[10.5px] text-inkFaint mt-0.5">
              {t.sex} · {t.ageClass} · last seen {t.lastSeen}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 max-w-3xl">
        <div className="panel p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-eyebrow">Individual</div>
              <h2 className="font-mono text-xl font-semibold mt-1">{selected.id}</h2>
              <div className="text-[11.5px] text-inkMuted mt-1">
                {selected.sex} · {selected.ageClass} · enrolled {selected.firstEnrolled}
              </div>
            </div>
            <div className="text-right">
              <div className="label-eyebrow">Home range</div>
              <div className="font-mono text-lg mt-1">{selected.areaSqKm} sq km</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="label-eyebrow mb-1">Stations used</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.stations.map((s) => (
                  <span key={s} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-panelAlt border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="label-eyebrow mb-1">Range area trend</div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={areaTrend(selected.areaSqKm)}>
                    <CartesianGrid stroke="#25322A" vertical={false} />
                    <XAxis dataKey="run" tick={{ fill: "#5C6B62", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{ background: "#141C17", border: "1px solid #25322A", fontSize: 11 }}
                      labelStyle={{ color: "#8FA096" }}
                    />
                    <Line type="monotone" dataKey="area" stroke="#C97A3D" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="label-eyebrow mb-3">Recent captures</div>
          {captures.length === 0 ? (
            <div className="text-[11.5px] text-inkMuted">No recent captures for this individual.</div>
          ) : (
            <div className="flex gap-3">
              {captures.map((c) => (
                <div key={c.id} className="text-center">
                  <ThumbPlaceholder tone={c.thumbnail} label={c.stationId} size="md" />
                  <div className="text-[10px] font-mono text-inkFaint mt-1">
                    {new Date(c.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
