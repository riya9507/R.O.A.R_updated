import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import DashboardScreen from "./screens/DashboardScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import MapScreen from "./screens/MapScreen";
import CameraTrapsScreen from "./screens/CameraTrapsScreen";
import ReportsScreen from "./screens/ReportsScreen";
import AlertsScreen from "./screens/AlertsScreen";
import { alerts, lastRun, reviewQueue } from "./data/mockData";
import { Screen } from "./types";

const TITLES: Record<Screen,string> = {
  dashboard: "Dashboard", analysis: "AI Analysis", map: "Tiger Map", cameras: "Camera Traps", reports: "Reports & Analytics", alerts: "Alerts",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const pendingReview = reviewQueue.filter(r => r.status === "pending").length;
  const activeAlerts = alerts.filter(a => !a.isSurveyArtefact).length;
  return <div className="h-screen flex"><Sidebar active={screen} onSelect={setScreen} pendingReview={pendingReview} activeAlerts={activeAlerts}/><div className="flex-1 flex flex-col min-w-0"><TopBar run={lastRun} title={TITLES[screen]}/><div className="flex-1 overflow-y-auto">{screen === "dashboard" && <DashboardScreen/>}{screen === "analysis" && <AnalysisScreen/>}{screen === "map" && <MapScreen/>}{screen === "cameras" && <CameraTrapsScreen/>}{screen === "reports" && <ReportsScreen/>}{screen === "alerts" && <AlertsScreen/>}</div></div></div>;
}
