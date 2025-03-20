
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
import { Eye, FileText, BarChart, HelpCircle, MessageCircle } from "lucide-react";

interface SupportTicketsTableProps {
  supportTickets: any[];
  isLoading: boolean;
  onStatusChange: (ticketId: string, newStatus: string) => Promise<void>;
  getStatusBadgeColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  onOpenTicket: (ticket: any) => void;
}

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({
  supportTickets,
  isLoading,
  onStatusChange,
  getStatusBadgeColor,
  formatDate,
  onOpenTicket,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading support tickets...</div>;
  }

  if (supportTickets.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No support tickets found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium max-w-xs truncate" title={ticket.subject}>
                {ticket.subject}
              </TableCell>
              <TableCell>
                {ticket.user_id ? ticket.user_id.substring(0, 8) + "..." : "N/A"}
              </TableCell>
              <TableCell>
                {ticket.category === "billing" && (
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Billing
                  </span>
                )}
                {ticket.category === "shipping" && (
                  <span className="flex items-center gap-1.5">
                    <BarChart className="h-4 w-4" /> Shipping
                  </span>
                )}
                {ticket.category === "technical" && (
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" /> Technical
                  </span>
                )}
                {ticket.category === "general" && (
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" /> General
                  </span>
                )}
                {!["billing", "shipping", "technical", "general"].includes(ticket.category) &&
                  ticket.category}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    ticket.priority === "urgent"
                      ? "bg-red-100 text-red-800"
                      : ticket.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : ticket.priority === "medium"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(ticket.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(ticket.status)}>
                  {ticket.status === "in_progress"
                    ? "In Progress"
                    : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onOpenTicket(ticket)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(ticket.id, "open")}
                        className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                      >
                        Set as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(ticket.id, "in_progress")}
                        className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                      >
                        Set as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(ticket.id, "resolved")}
                        className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                      >
                        Set as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(ticket.id, "closed")}
                        className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                      >
                        Set as Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupportTicketsTable;
