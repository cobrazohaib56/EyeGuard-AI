import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Camera, Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { incidents } from "@/data/mockData";
import { format } from "date-fns";

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-destructive/20 text-destructive border-destructive/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    info: "bg-primary/20 text-primary border-primary/30",
  };
  return (
    <Badge variant="outline" className={`${styles[severity] || styles.info} text-sm px-3 py-1`}>
      {severity}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-warning/20 text-warning border-warning/30",
    reviewed: "bg-success/20 text-success border-success/30",
    dismissed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`${styles[status] || styles.pending} text-sm px-3 py-1`}>
      {status}
    </Badge>
  );
}

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incident = incidents.find((inc) => inc.id === id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Incident not found</p>
        <Button variant="outline" onClick={() => navigate("/incidents")}>
          Back to Incidents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/incidents")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-foreground">{incident.id}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Incident Detail</p>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capture Image */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                Capture Frame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border border-border">
                <div className="text-center space-y-2">
                  <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Frame captured at {format(new Date(incident.timestamp), "HH:mm:ss")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                Incident Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-foreground">{incident.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Camera</p>
                  <p className="text-sm font-mono text-foreground flex items-center gap-1">
                    <Camera className="h-3 w-3" /> {incident.cameraName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {incident.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                  <p className="text-sm font-mono text-foreground flex items-center gap-1">
                    <Brain className="h-3 w-3" /> {incident.confidence}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Camera ID</p>
                  <p className="text-sm font-mono text-foreground">{incident.cameraId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-mono text-foreground">
                {format(new Date(incident.timestamp), "EEEE, MMMM dd yyyy")}
              </p>
              <p className="text-lg font-mono text-foreground font-bold">
                {format(new Date(incident.timestamp), "HH:mm:ss")}
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/incidents")}>
              Dismiss
            </Button>
            <Button className="flex-1">Mark Reviewed</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
