import {
  Camera,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Clock,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  dashboardStats,
  alerts,
  incidents,
  cameras,
} from "@/data/mockData";
import { format } from "date-fns";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentClass,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accentClass: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`rounded-lg p-2.5 ${accentClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    critical: "bg-destructive/20 text-destructive border-destructive/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    info: "bg-primary/20 text-primary border-primary/30",
  };
  return (
    <Badge
      variant="outline"
      className={styles[severity as keyof typeof styles] || styles.info}
    >
      {severity}
    </Badge>
  );
}

const Dashboard = () => {
  const activeCams = cameras.filter((c) => c.status === "active").length;
  const inactiveCams = cameras.filter((c) => c.status === "inactive").length;
  const errorCams = cameras.filter((c) => c.status === "error").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring overview
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidents Today"
          value={dashboardStats.totalIncidentsToday}
          subtitle="Detected threats"
          icon={ShieldAlert}
          accentClass="bg-destructive/10 text-destructive"
        />
        <StatCard
          title="Active Cameras"
          value={`${dashboardStats.activeCameras}/${dashboardStats.totalCameras}`}
          subtitle={`${errorCams} with errors`}
          icon={Camera}
          accentClass="bg-success/10 text-success"
        />
        <StatCard
          title="Alerts Pending"
          value={dashboardStats.alertsPending}
          subtitle={`${dashboardStats.criticalAlerts} critical`}
          icon={AlertTriangle}
          accentClass="bg-warning/10 text-warning"
        />
        <StatCard
          title="Detection Accuracy"
          value="94.7%"
          subtitle="YOLOv8 model"
          icon={Target}
          accentClass="bg-primary/10 text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Real-time Alerts */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px] px-6 pb-4">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex gap-3 rounded-md border border-border bg-secondary/50 p-3"
                  >
                    <div className="mt-0.5">
                      {alert.severity === "critical" ? (
                        <div className="h-2 w-2 rounded-full bg-destructive glow-red" />
                      ) : alert.severity === "warning" ? (
                        <div className="h-2 w-2 rounded-full bg-warning glow-amber" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-primary glow-blue" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-relaxed truncate">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {alert.cameraName}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {format(new Date(alert.timestamp), "HH:mm:ss")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Camera Status */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-success/10 border border-success/20 p-3 text-center">
                <p className="text-2xl font-bold text-success">{activeCams}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  Active
                </p>
              </div>
              <div className="rounded-lg bg-muted border border-border p-3 text-center">
                <p className="text-2xl font-bold text-muted-foreground">{inactiveCams}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  Inactive
                </p>
              </div>
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-center">
                <p className="text-2xl font-bold text-destructive">{errorCams}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  Error
                </p>
              </div>
            </div>

            <ScrollArea className="h-[210px]">
              <div className="space-y-1.5">
                {cameras.slice(0, 15).map((cam) => (
                  <div
                    key={cam.id}
                    className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          cam.status === "active"
                            ? "bg-success"
                            : cam.status === "error"
                            ? "bg-destructive"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-xs font-mono text-foreground">
                        {cam.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate ml-2">
                      {cam.location}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {incidents.slice(0, 5).map((inc) => (
              <div
                key={inc.id}
                className="rounded-lg border border-border bg-secondary/30 p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="aspect-video rounded bg-muted mb-2 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground">
                      {inc.cameraName}
                    </span>
                    <SeverityBadge severity={inc.severity} />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {format(new Date(inc.timestamp), "MMM dd, HH:mm:ss")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
