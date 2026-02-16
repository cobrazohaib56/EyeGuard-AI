// Mock data for the AI Theft Detection System

export type DetectionModel =
  | "theft-detection"
  | "intrusion-detection"
  | "loitering-detection"
  | "violence-detection"
  | "fire-smoke-detection"
  | "crowd-analysis";

export const detectionModels: { value: DetectionModel; label: string; endpoint: string }[] = [
  { value: "theft-detection", label: "Theft Detection (YOLOv8)", endpoint: "/api/detect/theft" },
  { value: "intrusion-detection", label: "Intrusion Detection", endpoint: "/api/detect/intrusion" },
  { value: "loitering-detection", label: "Loitering Detection", endpoint: "/api/detect/loitering" },
  { value: "violence-detection", label: "Violence Detection", endpoint: "/api/detect/violence" },
  { value: "fire-smoke-detection", label: "Fire & Smoke Detection", endpoint: "/api/detect/fire" },
  { value: "crowd-analysis", label: "Crowd Analysis", endpoint: "/api/detect/crowd" },
];

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "error";
  rtspUrl: string;
  lastFrameTimestamp: string;
  fps: number;
  detectionModel: DetectionModel;
  enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  status: "pending" | "reviewed" | "dismissed";
  description: string;
  thumbnailUrl: string;
  confidence: number;
}

export interface Alert {
  id: string;
  message: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  cameraName: string;
}

export interface SystemHealth {
  gpuUtilization: number;
  fpsProcessing: number;
  detectionAccuracy: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

const locations = [
  "Main Entrance", "Cash Counter A", "Cash Counter B", "Storage Room",
  "Aisle 1", "Aisle 2", "Aisle 3", "Aisle 4", "Aisle 5",
  "Back Door", "Parking Lot", "Electronics Section", "Jewelry Counter",
  "Warehouse", "Loading Dock", "Manager Office", "Break Room",
  "Pharmacy", "Self-Checkout", "Customer Service", "Deli Counter",
  "Produce Section", "Freezer Aisle", "Garden Center", "Fitting Room",
  "North Exit", "South Exit", "Roof Access",
];

const modelValues: DetectionModel[] = ["theft-detection", "intrusion-detection", "loitering-detection", "violence-detection", "fire-smoke-detection", "crowd-analysis"];

export const cameras: Camera[] = Array.from({ length: 28 }, (_, i) => ({
  id: `cam-${String(i + 1).padStart(3, "0")}`,
  name: `CAM-${String(i + 1).padStart(3, "0")}`,
  location: locations[i],
  status: (i < 22 ? "active" : i < 26 ? "inactive" : "error") as Camera["status"],
  rtspUrl: `rtsp://192.168.1.${100 + i}:554/stream${i + 1}`,
  lastFrameTimestamp: new Date(Date.now() - Math.random() * 60000).toISOString(),
  fps: i < 22 ? Math.floor(Math.random() * 10) + 25 : 0,
  detectionModel: modelValues[i % modelValues.length],
  enabled: i < 26,
}));

const incidentDescriptions = [
  "Suspicious item concealment detected near shelving unit",
  "Unauthorized access to restricted area",
  "Potential shoplifting — item removed from display without scanning",
  "Loitering detected in high-value merchandise zone",
  "Tag removal attempt detected",
  "Bag stuffing behavior identified",
  "Unusual movement pattern near emergency exit",
  "Cash register tampering detected",
  "After-hours motion detected in closed section",
  "Multiple items concealed in clothing",
];

export const incidents: Incident[] = Array.from({ length: 50 }, (_, i) => {
  const cam = cameras[Math.floor(Math.random() * cameras.length)];
  const hoursAgo = Math.random() * 72;
  return {
    id: `INC-${String(2024001 + i).padStart(7, "0")}`,
    cameraId: cam.id,
    cameraName: cam.name,
    location: cam.location,
    timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    severity: (i < 8 ? "critical" : i < 25 ? "warning" : "info") as Incident["severity"],
    status: (i < 15 ? "pending" : i < 40 ? "reviewed" : "dismissed") as Incident["status"],
    description: incidentDescriptions[i % incidentDescriptions.length],
    thumbnailUrl: `/placeholder.svg`,
    confidence: Math.floor(Math.random() * 25) + 75,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const alerts: Alert[] = incidents.slice(0, 20).map((inc, i) => ({
  id: `alert-${i + 1}`,
  message: inc.description,
  timestamp: inc.timestamp,
  severity: inc.severity,
  cameraName: inc.cameraName,
}));

export const systemHealth: SystemHealth = {
  gpuUtilization: 73,
  fpsProcessing: 28,
  detectionAccuracy: 94.7,
  cpuUsage: 45,
  memoryUsage: 62,
  uptime: "14d 7h 32m",
};

export const dashboardStats = {
  totalIncidentsToday: incidents.filter(
    (i) => new Date(i.timestamp).toDateString() === new Date().toDateString()
  ).length || 12,
  activeCameras: cameras.filter((c) => c.status === "active").length,
  totalCameras: cameras.length,
  alertsPending: incidents.filter((i) => i.status === "pending").length,
  criticalAlerts: incidents.filter((i) => i.severity === "critical" && i.status === "pending").length,
};

const userNames = [
  "Sarah Chen", "Marcus Johnson", "Emily Rodriguez", "David Kim",
  "Lisa Thompson", "James Wilson", "Anna Patel", "Michael Brown",
];

export const users: User[] = userNames.map((name, i) => ({
  id: `user-${String(i + 1).padStart(3, "0")}`,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@eyeguard.ai`,
  role: (i === 0 ? "admin" : "viewer") as User["role"],
  status: (i < 7 ? "active" : "inactive") as User["status"],
  lastLogin: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  createdAt: new Date(Date.now() - (30 + Math.random() * 300) * 86400000).toISOString(),
}));
