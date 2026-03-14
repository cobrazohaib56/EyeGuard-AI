import { apiClient, ApiPaginationResult } from "./apiClient";
import type { Camera as UiCamera, DetectionModel as UiDetectionModel } from "@/data/mockData";

// Backend camera type (partial, only fields we care about for the UI)
export interface ApiCamera {
  id: number;
  business: number;
  business_name: string;
  name: string;
  location: string;
  stream_url: string;
  stream_type: string;
  target_fps: number;
  motion_confidence: number;
  persist_frames: number;
  status: "active" | "inactive" | "maintenance" | "error";
  is_active: boolean;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiDetectionModel {
  id: number;
  name: string;
  model_type: string;
  model_type_display: string;
  model_path: string;
  confidence_threshold: number;
  description: string;
  is_active: boolean;
}

export interface CreateCameraPayload {
  business: number;
  name: string;
  location: string;
  stream_url: string;
  stream_type?: "rtsp" | "http" | "file" | "webcam";
  target_fps?: number;
  motion_confidence?: number;
  persist_frames?: number;
  status?: "active" | "inactive" | "maintenance" | "error";
}

const DEFAULT_STREAM_TYPE: CreateCameraPayload["stream_type"] = "rtsp";
const DEFAULT_TARGET_FPS = 10;
const DEFAULT_MOTION_CONFIDENCE = 0.6;
const DEFAULT_PERSIST_FRAMES = 5;

// Business selection:
// Use VITE_DEFAULT_BUSINESS_ID when provided, otherwise default to 1.
const envBusinessId = import.meta.env.VITE_DEFAULT_BUSINESS_ID;
export const DEFAULT_BUSINESS_ID = envBusinessId ? Number(envBusinessId) : 1;

function mapApiCameraToUiCamera(api: Partial<ApiCamera> & { [key: string]: any }): UiCamera {
  const rawId = api.id ?? api.pk;
  if (rawId === undefined || rawId === null) {
    throw new Error("Camera from API is missing id");
  }
  const detectionModel: UiDetectionModel = "theft-detection";

  return {
    id: String(rawId),
    name: api.name,
    location: api.location,
    status: api.status === "error" ? "error" : api.status === "active" ? "active" : "inactive",
    rtspUrl: api.stream_url,
    lastFrameTimestamp: api.last_active ?? api.updated_at ?? api.created_at,
    fps: api.target_fps ?? 0,
    detectionModel,
    enabled: api.is_active,
  };
}

export async function fetchCameras(): Promise<UiCamera[]> {
  const res = await apiClient.get<ApiPaginationResult<ApiCamera> | ApiCamera[]>("/api/cameras/");
  const data = Array.isArray(res.data) ? res.data : res.data.results;
  return data.map(mapApiCameraToUiCamera);
}

export async function createCamera(input: {
  name: string;
  location: string;
  rtspUrl: string;
}): Promise<UiCamera> {
  const payload: CreateCameraPayload = {
    business: DEFAULT_BUSINESS_ID,
    name: input.name,
    location: input.location,
    stream_url: input.rtspUrl,
    stream_type: DEFAULT_STREAM_TYPE,
    target_fps: DEFAULT_TARGET_FPS,
    motion_confidence: DEFAULT_MOTION_CONFIDENCE,
    persist_frames: DEFAULT_PERSIST_FRAMES,
    status: "active",
  };

  const res = await apiClient.post<ApiCamera>("/api/cameras/", payload);
  return mapApiCameraToUiCamera(res.data);
}

export async function deleteCamera(id: string): Promise<void> {
  await apiClient.delete(`/api/cameras/${id}/`);
}

export async function toggleCameraEnabled(camera: UiCamera): Promise<UiCamera> {
  const newStatus: ApiCamera["status"] = camera.enabled ? "inactive" : "active";
  const res = await apiClient.patch<ApiCamera>(`/api/cameras/${camera.id}/`, {
    status: newStatus,
    is_active: !camera.enabled,
  });
  return mapApiCameraToUiCamera(res.data);
}

export async function fetchDetectionModels(): Promise<ApiDetectionModel[]> {
  const res = await apiClient.get<ApiPaginationResult<ApiDetectionModel> | ApiDetectionModel[]>("/api/detection-models/");
  const data = Array.isArray(res.data) ? res.data : res.data.results;
  return data;
}

