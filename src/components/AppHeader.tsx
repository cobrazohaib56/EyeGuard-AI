import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { dashboardStats } from "@/data/mockData";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-xs font-mono text-muted-foreground">
            System Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>GPU: 73%</span>
          <span className="text-border">|</span>
          <span>FPS: 28</span>
          <span className="text-border">|</span>
          <span>Accuracy: 94.7%</span>
        </div>

        <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {dashboardStats.criticalAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {dashboardStats.criticalAlerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
