/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ground layer — near-black moss rather than pure black, read as
        // field-optics / night-vision rather than a generic dark theme.
        bg: "#0D1310",
        panel: "#141C17",
        panelAlt: "#1A2420",
        border: "#25322A",
        // Text
        ink: "#E7EDE8",
        inkMuted: "#8FA096",
        inkFaint: "#5C6B62",
        // Accents — pulled directly from the project's own diagram legend:
        // Red = Alerts, Green = Effort Ledger, Blue = Data Flow.
        amber: { DEFAULT: "#C97A3D", dim: "#8A5429" }, // tiger stripe / alert warm tone
        moss: { DEFAULT: "#5B8266", dim: "#3B5A44" }, // effort ledger / confirmed
        signal: { DEFAULT: "#4C7A93", dim: "#2E4C5B" }, // data flow / info
        danger: { DEFAULT: "#B4432D", dim: "#6E2A1D" },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      backgroundImage: {
        stripes:
          "repeating-linear-gradient(115deg, rgba(201,122,61,0.10) 0px, rgba(201,122,61,0.10) 2px, transparent 2px, transparent 14px)",
      },
    },
  },
  plugins: [],
};
