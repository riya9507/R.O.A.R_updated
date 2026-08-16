export type Screen = "dashboard" | "analysis" | "map" | "cameras" | "reports" | "alerts";

export interface Station {
  id: string;
  lat: number;
  lng: number;
  zone: "core" | "buffer";
  installedOn: string;
}

export interface CaptureEvent {
  id: string;
  tigerId: string;
  stationId: string;
  timestamp: string;
  thumbnail: string;
}

export interface Tiger {
  id: string;
  sex: "M" | "F" | "unknown";
  ageClass: "adult" | "sub-adult" | "cub";
  firstEnrolled: string;
  homeRange: [number, number][]; // [lat, lng]
  centroid: [number, number]; // [lat, lng]
  areaSqKm: number;
  lastSeen: string;
  stations: string[];
  stripeProfile: string;
  stripeConfidence: number;
}

export interface ReviewItem {
  id: string;
  captureThumbnail: string;
  stationId: string;
  timestamp: string;
  candidates: { tigerId: string; confidence: number; refThumbnail: string }[];
  status: "pending" | "confirmed" | "new-individual" | "rejected";
}

export type AlertType = "centroid-shift" | "new-station" | "buffer-approach" | "prolonged-absence";

export interface AlertItem {
  id: string;
  tigerId: string;
  type: AlertType;
  title: string;
  evidence: string;
  confidence: number;
  isSurveyArtefact: boolean;
  raisedOn: string;
}

export interface RunSummary {
  id: string;
  date: string;
  totalImages: number;
  blanksRemoved: number;
  quarantined: number;
  spaceSavedGb: number;
  timeSavedHrs: number;
  newIndividuals: number;
  ambiguousMatches: number;
}
export type ROARSettings = {
  tigerDetectionThreshold: number;
  stripeConfidenceThreshold: number;
  autoMatchThreshold: number;

  removeBlankFrames: boolean;
  detectDuplicates: boolean;
  generateThumbnails: boolean;
  readExifMetadata: boolean;

  alerts: {
    lowConfidence: boolean;
    unknownTiger: boolean;
    cameraInactive: boolean;
    highActivity: boolean;
  };
};
export const defaultROARSettings: ROARSettings = {
  tigerDetectionThreshold: 0.8,
  stripeConfidenceThreshold: 0.85,
  autoMatchThreshold: 0.9,

  removeBlankFrames: true,
  detectDuplicates: true,
  generateThumbnails: true,
  readExifMetadata: true,

  alerts: {
    lowConfidence: true,
    unknownTiger: true,
    cameraInactive: true,
    highActivity: true,
  },
};