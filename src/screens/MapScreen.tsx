import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stations, tigers } from "../data/mockData";

const TIGER_COLORS: Record<string, string> = {
  "PTR-F-014": "#C97A3D",
  "PTR-M-006": "#4C7A93",
  "PTR-F-021": "#5B8266",
  "PTR-M-011": "#B4432D",
};

export default function MapScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [visible, setVisible] = useState<Set<string>>(new Set(tigers.map(t => t.id)));
  const [selected, setSelected] = useState("PTR-M-006");

  function toggle(id: string) {
    setVisible(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true });
    mapRef.current = map;

    // Real geographic basemap. For the final fully-offline build, download the
    // Pench tiles and change this URL to /maps/pench/{z}/{x}/{y}.png.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      minZoom: 7,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.22));

    stations.forEach(s => {
      const color = s.zone === "core" ? "#E7EDE8" : "#8FA096";
      L.circleMarker([s.lat, s.lng], { radius: 6, color, weight: 2, fillColor: color, fillOpacity: 0.75 })
        .bindTooltip(`${s.id} · ${s.zone} zone`, { direction: "top", className: "roar-tooltip" })
        .addTo(map);
    });

    // Geographic reserve-area guide. Replace with the official Pench GeoJSON
    // boundary when the GIS boundary file is available.
    L.polygon([
      [22.00, 79.08], [21.98, 79.38], [21.88, 79.49], [21.65, 79.48],
      [21.56, 79.30], [21.60, 79.10], [21.78, 79.04],
    ], { color: "#5B8266", weight: 2, fillColor: "#5B8266", fillOpacity: 0.05, dashArray: "7 6" })
      .bindTooltip("Pench Tiger Reserve area", { className: "roar-tooltip" })
      .addTo(map);

    setTimeout(() => map.invalidateSize(), 150);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    tigers.filter(t => visible.has(t.id)).forEach(t => {
      const color = TIGER_COLORS[t.id] ?? "#C97A3D";
      const selectedTiger = t.id === selected;
      const polygon = L.polygon(t.homeRange, { color, weight: selectedTiger ? 3 : 1.5, fillColor: color, fillOpacity: selectedTiger ? 0.18 : 0.08 });
      polygon.bindTooltip(`${t.id} · ${t.areaSqKm} sq km`, { className: "roar-tooltip" });
      polygon.on("click", () => setSelected(t.id));
      polygon.addTo(map);
      const marker = L.circleMarker(t.centroid, { radius: selectedTiger ? 9 : 6, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1 });
      marker.bindTooltip(t.id, { className: "roar-tooltip" });
      marker.on("click", () => setSelected(t.id));
      marker.addTo(map);
      layersRef.current.push(polygon, marker);
    });
  }, [visible, selected]);

  function focusTiger(id: string) {
    const tiger = tigers.find(t => t.id === id);
    const map = mapRef.current;
    if (!tiger || !map) return;
    setSelected(id);
    if (!visible.has(id)) toggle(id);
    map.flyTo(tiger.centroid, 13, { duration: 0.8 });
  }

  const selectedTiger = tigers.find(t => t.id === selected) ?? tigers[0];

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-start justify-between"><div><div className="label-eyebrow">Geospatial intelligence</div><h2 className="text-2xl font-semibold mt-1">Tiger Map</h2><p className="text-[12px] text-inkMuted mt-1">Real geographic map with camera GPS positions, tiger observations and individual home ranges.</p></div><div className="panel px-3 py-2 text-[10px] text-inkMuted">Map layer: <span className="text-signal">Leaflet geographic tiles</span></div></div>
      <div className="flex-1 min-h-0 flex gap-4">
        <div className="flex-1 panel overflow-hidden relative min-h-[540px]"><div ref={containerRef} className="w-full h-full min-h-[540px]" /><div className="absolute top-3 left-3 z-[500] panel px-3 py-2 text-[10px]">PENCH TIGER RESERVE · TIGER OBSERVATIONS ONLY</div><div className="absolute bottom-4 left-4 z-[500] panel px-3 py-2 text-[9px] text-inkMuted space-y-1"><div><i className="inline-block w-2 h-2 rounded-full bg-ink mr-1"/>Core camera</div><div><i className="inline-block w-2 h-2 rounded-full bg-inkMuted mr-1"/>Buffer camera</div><div><i className="inline-block w-3 h-2 border border-dashed border-moss mr-1"/>Reserve guide</div></div></div>
        <aside className="w-80 shrink-0 space-y-3 overflow-y-auto">
          <div className="panel p-4"><div className="label-eyebrow">Tiger catalogue</div><div className="space-y-1.5 mt-3">{tigers.map(t => <button key={t.id} onClick={() => focusTiger(t.id)} className={`w-full text-left p-2.5 rounded border ${selected === t.id ? "border-amber/50 bg-panelAlt" : "border-transparent hover:bg-panelAlt"}`}><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{background:TIGER_COLORS[t.id]}}/><span className="font-mono text-[11px]">{t.id}</span><span className="ml-auto text-[9px] text-inkFaint">{Math.round(t.stripeConfidence*100)}%</span></div><div className="text-[9px] text-inkFaint mt-1">Last seen {t.lastSeen} · {t.areaSqKm} sq km</div></button>)}</div></div>
          <div className="panel p-4"><div className="label-eyebrow">Map visibility</div><div className="space-y-2 mt-3">{tigers.map(t => <label key={t.id} className="flex items-center justify-between text-[10px] text-inkMuted"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:TIGER_COLORS[t.id]}}/>{t.id}</span><input type="checkbox" checked={visible.has(t.id)} onChange={() => toggle(t.id)} className="accent-amber"/></label>)}</div></div>
          <div className="panel p-4"><div className="label-eyebrow">Selected tiger</div><div className="text-lg font-semibold mt-1">{selectedTiger.id}</div><div className="grid grid-cols-2 gap-3 mt-3"><div><span className="detail-label">Stripe ID</span><b>{selectedTiger.stripeProfile}</b></div><div><span className="detail-label">Confidence</span><b>{Math.round(selectedTiger.stripeConfidence*100)}%</b></div><div><span className="detail-label">Last seen</span><b>{selectedTiger.lastSeen}</b></div><div><span className="detail-label">Cameras</span><b>{selectedTiger.stations.length}</b></div></div><div className="mt-3 text-[9.5px] text-inkFaint">Camera ID → stripe profile → catalogue Tiger ID → camera GPS → observation on map.</div></div>
        </aside>
      </div>
    </div>
  );
}
