import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  feedback_count: number;
}

interface UsersTableProps {
  users: UserData[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Registered Users
        </CardTitle>
        <CardDescription>All users and their activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Feedback Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <TableCell className="font-medium">
                    {user.display_name || 'Anonymous User'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="animate-scale-in">
                      {user.feedback_count}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground animate-fade-in">
                    No users registered yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
