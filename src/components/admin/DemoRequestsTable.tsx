
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoRequestsTableProps {
  demoRequests: any[];
  isLoading: boolean;
  onStatusChange: (demoId: string, newStatus: string) => Promise<void>;
  getStatusBadgeColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const DemoRequestsTable: React.FC<DemoRequestsTableProps> = ({
  demoRequests,
  isLoading,
  onStatusChange,
  getStatusBadgeColor,
  formatDate,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading demo requests...</div>;
  }

  if (demoRequests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No demo requests found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Demo Type</TableHead>
            <TableHead>Preferred Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoRequests.map((demo) => (
            <TableRow key={demo.id}>
              <TableCell className="font-medium">{demo.name || "N/A"}</TableCell>
              <TableCell>{demo.email || "N/A"}</TableCell>
              <TableCell>{demo.company || "N/A"}</TableCell>
              <TableCell>{demo.demo_type || "N/A"}</TableCell>
              <TableCell>{demo.preferred_date || "N/A"}</TableCell>
              <TableCell>{formatDate(demo.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(demo.status)}>
                  {demo.status || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(demo.id, "pending")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(demo.id, "scheduled")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(demo.id, "completed")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(demo.id, "cancelled")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemoRequestsTable;
