import { useState } from "react";
import { Plus, Search, Shield, UserCheck, Eye, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { users, type User } from "@/data/mockData";
import { format } from "date-fns";
import { toast } from "sonner";

function RoleBadge({ role }: { role: User["role"] }) {
  const styles: Record<string, string> = {
    admin: "bg-destructive/20 text-destructive border-destructive/30",
    operator: "bg-warning/20 text-warning border-warning/30",
    viewer: "bg-primary/20 text-primary border-primary/30",
  };
  const icons: Record<string, React.ElementType> = {
    admin: Shield,
    operator: UserCheck,
    viewer: Eye,
  };
  const Icon = icons[role];
  return (
    <Badge variant="outline" className={`${styles[role]} gap-1`}>
      <Icon className="h-3 w-3" />
      {role}
    </Badge>
  );
}

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users registered</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setAddOpen(false);
                toast.success("User invited");
              }}
            >
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider">Full Name</Label>
                <Input placeholder="John Doe" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider">Email</Label>
                <Input type="email" placeholder="john@sentinel.ai" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider">Role</Label>
                <Select defaultValue="viewer">
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Invite</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden md:table-cell">Last Login</TableHead>
                <TableHead className="text-xs uppercase tracking-wider hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-accent/50">
                  <TableCell className="font-medium text-sm">{user.name}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                    {format(new Date(user.lastLogin), "MMM dd, HH:mm")}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden lg:table-cell">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
