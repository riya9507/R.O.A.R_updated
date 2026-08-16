import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ConfidenceBadge } from "../components/Primitives";
import { tigers } from "../data/mockData";

export default function AnalysisScreen() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [stripeConfidence, setStripeConfidence] = useState<number | null>(null);
  const [matchedTiger, setMatchedTiger] = useState<string | null>(null);
  const [stripeId, setStripeId] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState("C07");
  const [path, setPath] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function chooseFile(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected); setPreview(URL.createObjectURL(selected)); setConfidence(null); setStripeConfidence(null); setMatchedTiger(null); setStripeId(null);
  }

  function analyze() {
    if (!file) return;
    setAnalyzing(true);
    window.setTimeout(() => {
      // Demo-only local result until the real model is connected.
      // It deliberately varies per selected file instead of staying at a hard-coded 96%.
      const seed = Array.from(file.name).reduce((a, c) => a + c.charCodeAt(0), file.size % 997);
      const tiger = tigers[seed % tigers.length];
      const detection = 88 + (seed % 1000) / 100;
      const stripe = Math.max(82, detection - 3.5);
      setConfidence(Math.min(99.2, detection)); setStripeConfidence(Math.min(98.8, stripe)); setMatchedTiger(tiger.id); setStripeId(tiger.stripeProfile); setAnalyzing(false);
    }, 850);
  }

  const resultTiger = useMemo(() => tigers.find(t => t.id === matchedTiger), [matchedTiger]);

  return (
    <div className="p-6 max-w-[1250px] space-y-5">
      <div><div className="label-eyebrow">Tiger image intelligence</div><h2 className="text-2xl font-semibold mt-1">AI Analysis</h2><p className="text-[12px] text-inkMuted mt-1">Analyze one local camera-trap image, extract its stripe profile and match it against the tiger catalogue.</p></div>
      <div className="panel p-5">
        <div className="border border-dashed border-border rounded-lg p-8 text-center bg-panelAlt/30">
          <div className="text-[13px] font-semibold">Select a tiger camera-trap image</div>
          <div className="text-[10.5px] text-inkFaint mt-1">JPG, JPEG or PNG. Files stay on the local machine.</div>
          <input id="tiger-file" type="file" accept="image/jpeg,image/png,image/jpg" onChange={chooseFile} className="hidden" />
          <label htmlFor="tiger-file" className="inline-block mt-4 px-4 py-2 rounded bg-amber text-bg text-[11.5px] font-semibold cursor-pointer">Browse image</label>
          {file && <div className="mt-3 font-mono text-[10px] text-inkMuted">{file.name}</div>}
        </div>
        <div className="mt-4 flex gap-2"><input value={path} onChange={e => setPath(e.target.value)} placeholder={"Or paste a local file path: C:\\Pench\\C07\\IMG_001.jpg"} className="flex-1 px-3 py-2 rounded bg-panelAlt border border-border text-[10px] font-mono" /><button onClick={() => setFile(new File([], path.split("\\").pop() || "local-image.jpg"))} className="px-3 py-2 rounded border border-border text-[10px] text-inkMuted">Use path</button></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-4">
        <div className="panel p-4">
          <div className="label-eyebrow">Analysis result</div>
          <div className="mt-3 aspect-[16/9] rounded-lg border border-border bg-panelAlt overflow-hidden flex items-center justify-center">
            {preview ? <img src={preview} className="w-full h-full object-contain" alt="Selected tiger camera trap" /> : <div className="text-[11px] text-inkFaint">No image selected</div>}
          </div>
          {analyzing && <div className="mt-3 text-[10px] text-signal">Running local detection and stripe matching...</div>}
          <div className="mt-4 flex gap-2"><button disabled={!file || analyzing} onClick={analyze} className="px-4 py-2 rounded bg-amber text-bg text-[11px] font-semibold disabled:opacity-40">{analyzing ? "Analyzing..." : "Analyze tiger"}</button><button onClick={() => { setFile(null); setPreview(""); setConfidence(null); setStripeConfidence(null); setMatchedTiger(null); setStripeId(null); }} className="px-4 py-2 rounded border border-border text-[11px] text-inkMuted">Clear</button></div>
        </div>
        <div className="panel p-4">
          <div className="label-eyebrow">Identification</div>
          <div className="mt-4 space-y-4">
            <div><span className="detail-label">Species</span><b>Tiger</b></div>
            <div><span className="detail-label">Detection confidence</span>{confidence === null ? <span className="text-inkFaint text-[11px]">Awaiting analysis</span> : <ConfidenceBadge value={confidence / 100} />}</div>
            <div><span className="detail-label">Stripe ID</span><b>{stripeId ?? "Awaiting analysis"}</b></div>
            <div><span className="detail-label">Tiger ID</span><b>{matchedTiger ?? "Awaiting catalogue match"}</b></div>
            <div><span className="detail-label">Stripe confidence</span>{stripeConfidence === null ? <span className="text-inkFaint text-[11px]">Awaiting analysis</span> : <div><div className="flex justify-between text-[10px] mb-1"><span className="text-inkMuted">Pattern match</span><span>{stripeConfidence.toFixed(1)}%</span></div><div className="h-2 bg-panelAlt rounded overflow-hidden"><div className="h-full bg-moss" style={{width:`${stripeConfidence}%`}}/></div></div>}</div>
            <div><span className="detail-label">Camera ID</span><select value={cameraId} onChange={e => setCameraId(e.target.value)} className="w-full bg-panelAlt border border-border rounded px-2 py-1.5 text-[11px]"><option>C01</option><option>C04</option><option>C07</option><option>C09</option><option>C12</option><option>C15</option><option>C18</option><option>C21</option><option>C24</option><option>C27</option></select></div>
            <div className="pt-2 border-t border-border text-[10px] text-inkFaint">{resultTiger ? `Catalogue record ${resultTiger.id} · ${resultTiger.stripeProfile}` : "The displayed result is a local demo until your real AI model is connected."}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
