# R.O.A.R — Robust Offline Analytics & Re-identification

R.O.A.R is a tiger-only field intelligence UI for Pench Tiger Reserve.

## Included in this updated build

- Dashboard with tiger-only infographics
- AI Analysis with local image selection and a local file-path field
- Dynamic demo confidence instead of a fixed 96% value
- Stripe Profile ID -> Tiger ID catalogue presentation
- Real geographic Leaflet map with camera GPS coordinates and tiger home ranges
- Camera Trap screen with local folder/file path input
- Reports and analytics
- Officer Alerts
- Local officer login in the top-right corner
- No Settings page and no backend-URL field in the UI
- No other wildlife species in the application UI

## Run

Open a terminal in this folder (the folder containing package.json):

```powershell
npm install
npm run dev
```

## Local officer login

Prototype credentials:

- officer / roar2026
- admin / roaradmin

These are demo credentials for the local UI and should be replaced by your real authentication before deployment.

## Map

The map is a real geographic Leaflet map and currently uses OpenStreetMap tiles for development. It does not use the old JPG/image-map approach.

For the final completely offline deployment, package Pench map tiles inside `public/maps/pench/{z}/{x}/{y}.png` and change the tile URL in `src/screens/MapScreen.tsx` from the OpenStreetMap URL to `/maps/pench/{z}/{x}/{y}.png`.

The camera coordinates in `src/data/mockData.ts` are demo geographic coordinates. Replace them with the actual GPS coordinates supplied by the Pench camera-trap/GIS data. The tiger centroid and home-range geometry should likewise come from the real observation database/model output.

## AI integration

`src/screens/AnalysisScreen.tsx` currently demonstrates a dynamic local result so the UI is not stuck at 96%. It is deliberately marked as demo behavior. Replace the `analyze()` result block with the response from your local tiger detection + stripe matching model when the model is ready.

Recommended model response:

- tiger_detected
- detection_confidence
- stripe_id
- stripe_confidence
- tiger_id
- camera_id
- timestamp
- image_path
