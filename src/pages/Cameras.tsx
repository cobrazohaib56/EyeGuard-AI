import { useState } from "react";
import {
  Plus,
  LayoutGrid,
  List,
  MapPin,
  Clock,
  Trash2,
  Eye,
  Power,
  PowerOff,
  Brain,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cameras as initialCameras, detectionModels, type Camera, type DetectionModel } from "@/data/mockData";
import { format } from "date-fns";
import { toast } from "sonner";

function StatusIndicator({ status, enabled }: { status: Camera["status"]; enabled: boolean }) {
  if (!enabled)
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="text-xs text-muted-foreground">Disabled</span>
      </div>
    );
  if (status === "active")
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-success glow-green" />
        <span className="text-xs text-success">Active</span>
      </div>
    );
  if (status === "error")
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive glow-red" />
        <span className="text-xs text-destructive">Error</span>
      </div>
    );
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
      <span className="text-xs text-muted-foreground">Inactive</span>
    </div>
  );
}

const Cameras = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [cameraList, setCameraList] = useState<Camera[]>(initialCameras);
  const [newModel, setNewModel] = useState<DetectionModel>("theft-detection");

  const handleDelete = (id: string) => {
    setCameraList((prev) => prev.filter((c) => c.id !== id));
    toast.success("Camera removed");
  };

  const handleToggle = (id: string) => {
    setCameraList((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled, status: c.enabled ? "inactive" : "active" } : c
      )
    );
  };

  const modelLabel = (model: DetectionModel) =>
    detectionModels.find((m) => m.value === model)?.label || model;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Camera Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cameraList.length} cameras configured
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Camera
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Add New Camera</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAddOpen(false);
                  toast.success("Camera added");
                }}
              >
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Camera Name</Label>
                  <Input placeholder="CAM-029" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Location</Label>
                  <Input placeholder="e.g. Main Entrance" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">RTSP URL</Label>
                  <Input
                    placeholder="rtsp://192.168.1.x:554/stream"
                    className="bg-secondary border-border font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="h-3 w-3" /> Detection Model
                  </Label>
                  <Select value={newModel} onValueChange={(v) => setNewModel(v as DetectionModel)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {detectionModels.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          <div className="flex flex-col">
                            <span>{m.label}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{m.endpoint}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Camera</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cameraList.map((cam) => (
            <Card
              key={cam.id}
              className={`border-border hover:border-primary/30 transition-colors ${!cam.enabled ? "opacity-50" : ""}`}
            >
              <CardContent className="p-4">
                <div className="aspect-video rounded bg-muted mb-3 flex items-center justify-center relative">
                  <Eye className="h-8 w-8 text-muted-foreground/20" />
                  {cam.enabled && cam.status === "active" && cam.fps > 0 && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono bg-background/80 px-1.5 py-0.5 rounded text-success">
                      {cam.fps} FPS
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-foreground">{cam.name}</span>
                    <StatusIndicator status={cam.status} enabled={cam.enabled} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {cam.location}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Brain className="h-3 w-3" />
                    <span className="truncate">{modelLabel(cam.detectionModel)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {cam.enabled && cam.status === "active"
                      ? format(new Date(cam.lastFrameTimestamp), "HH:mm:ss")
                      : "—"}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => handleToggle(cam.id)}
                    >
                      {cam.enabled ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {cam.enabled ? "Disable" : "Enable"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive gap-1">
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {cam.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the camera configuration. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(cam.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {cameraList.map((cam) => (
                <div
                  key={cam.id}
                  className={`flex items-center justify-between p-4 hover:bg-accent/50 ${!cam.enabled ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <StatusIndicator status={cam.status} enabled={cam.enabled} />
                    <div>
                      <span className="font-mono text-sm font-semibold text-foreground">{cam.name}</span>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {cam.location}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5">
                          {modelLabel(cam.detectionModel)}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">{cam.rtspUrl}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cam.enabled && cam.status === "active" && (
                      <span className="text-xs font-mono text-success">{cam.fps} FPS</span>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleToggle(cam.id)}>
                      {cam.enabled ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {cam.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the camera configuration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(cam.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cameras;
