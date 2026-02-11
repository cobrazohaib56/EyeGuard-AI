import { useState } from "react";
import { Search, Download, ChevronDown, ChevronUp, Eye, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { incidents } from "@/data/mockData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: "bg-destructive/20 text-destructive border-destructive/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    info: "bg-primary/20 text-primary border-primary/30",
  };
  return <Badge variant="outline" className={styles[severity] || styles.info}>{severity}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-warning/20 text-warning border-warning/30",
    reviewed: "bg-success/20 text-success border-success/30",
    dismissed: "bg-muted text-muted-foreground border-border",
  };
  return <Badge variant="outline" className={styles[status] || styles.pending}>{status}</Badge>;
}

const Incidents = () => {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = incidents.filter((inc) => {
    const matchSearch =
      inc.cameraName.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incident Archive</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} incidents found</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px] bg-secondary border-border">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Camera</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Location</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Timestamp</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Severity</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden lg:table-cell">Confidence</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inc) => (
                <>
                  <TableRow
                    key={inc.id}
                    className="border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => setExpandedId(expandedId === inc.id ? null : inc.id)}
                  >
                    <TableCell className="font-mono text-xs">{inc.id}</TableCell>
                    <TableCell className="font-mono text-xs">{inc.cameraName}</TableCell>
                    <TableCell className="text-xs hidden md:table-cell text-muted-foreground">{inc.location}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {format(new Date(inc.timestamp), "MMM dd, HH:mm")}
                    </TableCell>
                    <TableCell><SeverityBadge severity={inc.severity} /></TableCell>
                    <TableCell><StatusBadge status={inc.status} /></TableCell>
                    <TableCell className="font-mono text-xs hidden lg:table-cell">{inc.confidence}%</TableCell>
                    <TableCell>
                      {expandedId === inc.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedId === inc.id && (
                    <TableRow key={`${inc.id}-detail`} className="border-border">
                      <TableCell colSpan={8} className="bg-secondary/30 p-4">
                        <div className="flex gap-4">
                          <div className="w-48 h-32 rounded bg-muted flex items-center justify-center shrink-0">
                            <Eye className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <p className="text-sm text-foreground">{inc.description}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>Camera: <span className="font-mono text-foreground">{inc.cameraName}</span></span>
                              <span>Location: <span className="text-foreground">{inc.location}</span></span>
                              <span>Confidence: <span className="font-mono text-foreground">{inc.confidence}%</span></span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground">
                              {format(new Date(inc.timestamp), "EEEE, MMMM dd yyyy 'at' HH:mm:ss")}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 mt-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/incidents/${inc.id}`);
                              }}
                            >
                              <ExternalLink className="h-3 w-3" /> View Full Details
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
