import { useMemo } from "react";
import { StatCard } from "../components/Primitives";
import { alerts, recentCaptures, reviewQueue, stations, tigers, lastRun } from "../data/mockData";

export default function DashboardScreen() {
  const avgConfidence = useMemo(() => tigers.reduce((a, t) => a + t.stripeConfidence, 0) / tigers.length, []);
  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div><div className="label-eyebrow">Pench Tiger Reserve</div><h2 className="text-2xl font-semibold mt-1">R.O.A.R intelligence dashboard</h2><p className="text-[12px] text-inkMuted mt-1">Tiger-only observation, identification and movement intelligence for field officers.</p></div>
        <div className="panel px-3 py-2 text-[10px] text-inkMuted">Data mode: <span className="text-moss font-medium">Offline</span></div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Tiger catalogue IDs" value={String(tigers.length)} sub="Individuals currently tracked" tone="amber" />
        <StatCard label="Images analyzed" value={lastRun.totalImages.toLocaleString()} sub="Current local run" />
        <StatCard label="Active cameras" value={String(stations.length)} sub="Registered stations" tone="moss" />
        <StatCard label="Stripe confidence" value={`${(avgConfidence * 100).toFixed(1)}%`} sub="Catalogue average" tone="moss" />
        <StatCard label="Officer alerts" value={String(alerts.filter(a => !a.isSurveyArtefact).length)} sub="Require attention" tone="danger" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="panel p-4 xl:col-span-2">
          <div className="flex items-center justify-between"><div><div className="label-eyebrow">Tiger activity</div><div className="text-[13px] font-semibold mt-1">Recent observations by individual</div></div><div className="text-[10px] text-inkFaint">Last 7 observation days</div></div>
          <div className="h-48 mt-4 flex items-end gap-3 border-b border-border px-2">
            {[32, 44, 39, 58, 51, 67, 74, 61, 83, 77, 91, 86, 96, 88].map((v, i) => <div key={i} className="flex-1 flex flex-col justify-end gap-1"><div className="bg-amber/70 rounded-t" style={{height:`${v}%`}} /><div className="text-[8px] text-inkFaint text-center">{i + 1}</div></div>)}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-[9px] text-inkMuted"><span><i className="inline-block w-2 h-2 rounded-full bg-amber mr-1"/>PTR-M-006</span><span><i className="inline-block w-2 h-2 rounded-full bg-moss mr-1"/>PTR-F-014</span><span><i className="inline-block w-2 h-2 rounded-full bg-signal mr-1"/>PTR-F-021</span><span><i className="inline-block w-2 h-2 rounded-full bg-danger mr-1"/>PTR-M-011</span></div>
        </div>
        <div className="panel p-4"><div className="label-eyebrow">Identification pipeline</div><div className="text-[13px] font-semibold mt-1">Stripe ID to Tiger ID</div><div className="space-y-3 mt-5">{[["Image detected","98.4%","moss"],["Stripe profile extracted","94.2%","signal"],["Catalogue match","91.7%","amber"],["Officer verification","Queue","danger"]].map(([a,b,c]) => <div key={a}><div className="flex justify-between text-[10px]"><span className="text-inkMuted">{a}</span><span className={`text-${c}`}>{b}</span></div><div className="h-1.5 bg-panelAlt rounded mt-1"><div className={`h-full bg-${c} rounded`} style={{width:b.endsWith('%')?b:'100%'}}/></div></div>)}</div></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="panel p-4"><div className="flex justify-between"><div><div className="label-eyebrow">Recent tiger captures</div><div className="text-[13px] font-semibold mt-1">Latest identified observations</div></div><span className="text-[10px] text-inkFaint">{recentCaptures.length} records</span></div><div className="grid grid-cols-2 gap-2 mt-4">{recentCaptures.map(c => <div key={c.id} className="rounded border border-border bg-panelAlt p-3"><div className="text-[11px] font-mono text-amber">{c.tigerId}</div><div className="text-[10px] text-inkMuted mt-1">Camera {c.stationId}</div><div className="text-[9px] text-inkFaint mt-2">{new Date(c.timestamp).toLocaleString()}</div></div>)}</div></div>
        <div className="panel p-4"><div className="label-eyebrow">Officer queue</div><div className="text-[13px] font-semibold mt-1">Items requiring review</div><div className="mt-4 space-y-2">{reviewQueue.map(q => <div key={q.id} className="flex justify-between items-center border-b border-border pb-2"><div><div className="font-mono text-[10px]">{q.stationId} · {q.id}</div><div className="text-[9px] text-inkFaint">{q.candidates.length ? "Ambiguous tiger match" : "No catalogue match"}</div></div><span className="text-[9px] text-amber">Pending</span></div>)}</div></div>
      </div>
    </div>
  );
}
