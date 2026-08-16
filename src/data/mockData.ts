import { AlertItem, CaptureEvent, ReviewItem, RunSummary, Station, Tiger } from "../types";

// Geographic demo coordinates around Pench Tiger Reserve.
// Replace these with the official GPS coordinates of your actual camera traps.
export const stations: Station[] = [
  { id: "C01", lat: 21.8352, lng: 79.2181, zone: "core", installedOn: "2022-03-01" },
  { id: "C04", lat: 21.8614, lng: 79.2687, zone: "core", installedOn: "2022-03-01" },
  { id: "C07", lat: 21.8048, lng: 79.3015, zone: "core", installedOn: "2022-03-01" },
  { id: "C09", lat: 21.8841, lng: 79.3376, zone: "core", installedOn: "2023-06-15" },
  { id: "C12", lat: 21.7586, lng: 79.2864, zone: "core", installedOn: "2022-03-01" },
  { id: "C15", lat: 21.7279, lng: 79.3562, zone: "core", installedOn: "2022-03-01" },
  { id: "C18", lat: 21.7863, lng: 79.4238, zone: "buffer", installedOn: "2024-01-10" },
  { id: "C21", lat: 21.6658, lng: 79.2259, zone: "buffer", installedOn: "2022-03-01" },
  { id: "C24", lat: 21.7046, lng: 79.4724, zone: "buffer", installedOn: "2025-11-02" },
  { id: "C27", lat: 21.6168, lng: 79.1427, zone: "buffer", installedOn: "2022-03-01" },
];

function stationPoint(id: string): [number, number] {
  const station = stations.find((s) => s.id === id) ?? stations[0];
  return [station.lat, station.lng];
}

function rangeAround(center: [number, number], dLat: number, dLng: number): [number, number][] {
  const [lat, lng] = center;
  return [
    [lat + dLat, lng - dLng],
    [lat + dLat * 0.75, lng + dLng],
    [lat - dLat * 0.35, lng + dLng * 1.05],
    [lat - dLat, lng + dLng * 0.35],
    [lat - dLat * 0.7, lng - dLng],
  ];
}

export const tigers: Tiger[] = [
  {
    id: "PTR-F-014", sex: "F", ageClass: "adult", firstEnrolled: "2022-04-11",
    homeRange: rangeAround(stationPoint("C04"), 0.045, 0.055),
    centroid: [21.835, 79.270], areaSqKm: 18.4, lastSeen: "2026-08-10",
    stations: ["C01", "C04", "C07"], stripeProfile: "SP-014", stripeConfidence: 0.93,
  },
  {
    id: "PTR-M-006", sex: "M", ageClass: "adult", firstEnrolled: "2021-11-02",
    homeRange: rangeAround(stationPoint("C09"), 0.060, 0.075),
    centroid: [21.814, 79.351], areaSqKm: 27.1, lastSeen: "2026-08-14",
    stations: ["C07", "C09", "C12", "C15", "C18"], stripeProfile: "SP-006", stripeConfidence: 0.968,
  },
  {
    id: "PTR-F-021", sex: "F", ageClass: "sub-adult", firstEnrolled: "2024-02-20",
    homeRange: rangeAround(stationPoint("C21"), 0.035, 0.050),
    centroid: [21.665, 79.236], areaSqKm: 9.8, lastSeen: "2026-08-12",
    stations: ["C21", "C27"], stripeProfile: "SP-021", stripeConfidence: 0.91,
  },
  {
    id: "PTR-M-011", sex: "M", ageClass: "sub-adult", firstEnrolled: "2025-01-05",
    homeRange: rangeAround(stationPoint("C24"), 0.040, 0.055),
    centroid: [21.716, 79.438], areaSqKm: 14.6, lastSeen: "2026-07-30",
    stations: ["C18", "C24"], stripeProfile: "SP-011", stripeConfidence: 0.88,
  },
];

export const recentCaptures: CaptureEvent[] = [
  { id: "cap-1", tigerId: "PTR-M-006", stationId: "C18", timestamp: "2026-08-14T05:12:00", thumbnail: "amber" },
  { id: "cap-2", tigerId: "PTR-F-014", stationId: "C04", timestamp: "2026-08-10T19:44:00", thumbnail: "moss" },
  { id: "cap-3", tigerId: "PTR-F-021", stationId: "C21", timestamp: "2026-08-12T04:02:00", thumbnail: "signal" },
  { id: "cap-4", tigerId: "PTR-M-011", stationId: "C24", timestamp: "2026-07-30T22:18:00", thumbnail: "amber" },
];

export const reviewQueue: ReviewItem[] = [
  { id: "rev-1", captureThumbnail: "amber", stationId: "C09", timestamp: "2026-08-13T06:21:00", candidates: [
    { tigerId: "PTR-M-006", confidence: 0.58, refThumbnail: "moss" },
    { tigerId: "PTR-M-011", confidence: 0.51, refThumbnail: "signal" },
  ], status: "pending" },
  { id: "rev-2", captureThumbnail: "signal", stationId: "C15", timestamp: "2026-08-11T18:05:00", candidates: [
    { tigerId: "PTR-F-014", confidence: 0.62, refThumbnail: "amber" },
  ], status: "pending" },
  { id: "rev-3", captureThumbnail: "moss", stationId: "C27", timestamp: "2026-08-09T05:47:00", candidates: [], status: "pending" },
];

export const alerts: AlertItem[] = [
  { id: "al-1", tigerId: "PTR-M-006", type: "buffer-approach", title: "PTR-M-006 moving toward buffer stations", evidence: "Captured at C18 (buffer) on 3 of last 4 runs, vs 0 of prior 6 runs.", confidence: 0.84, isSurveyArtefact: false, raisedOn: "2026-08-14" },
  { id: "al-2", tigerId: "PTR-F-014", type: "centroid-shift", title: "PTR-F-014 range centroid shifted", evidence: "Centroid movement detected across recent observation runs.", confidence: 0.71, isSurveyArtefact: false, raisedOn: "2026-08-10" },
  { id: "al-3", tigerId: "PTR-M-011", type: "new-station", title: "PTR-M-011 first capture at C24", evidence: "C24 is a newer station; increased coverage may explain the observation.", confidence: 0.66, isSurveyArtefact: true, raisedOn: "2026-07-30" },
  { id: "al-4", tigerId: "PTR-F-021", type: "prolonged-absence", title: "PTR-F-021 absent from usual stations", evidence: "No capture at C21 or C27 during the expected recent interval.", confidence: 0.77, isSurveyArtefact: false, raisedOn: "2026-08-12" },
];

export const lastRun: RunSummary = {
  id: "run-2026-08-14", date: "2026-08-14", totalImages: 214380, blanksRemoved: 187210,
  quarantined: 4120, spaceSavedGb: 96.4, timeSavedHrs: 312, newIndividuals: 1, ambiguousMatches: 3,
};
