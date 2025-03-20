
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, FileText, BarChart, HelpCircle, MessageCircle } from "lucide-react";

interface TicketDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTicket: any;
  ticketMessages: any[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendingMessage: boolean;
  handleSendMessage: () => Promise<void>;
  handleSupportTicketStatusChange: (ticketId: string, newStatus: string) => Promise<void>;
  getStatusBadgeColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const TicketDetailsDialog: React.FC<TicketDetailsDialogProps> = ({
  open,
  onOpenChange,
  selectedTicket,
  ticketMessages,
  newMessage,
  setNewMessage,
  sendingMessage,
  handleSendMessage,
  handleSupportTicketStatusChange,
  getStatusBadgeColor,
  formatDate,
}) => {
  if (!selectedTicket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedTicket.subject}</DialogTitle>
          <DialogDescription className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadgeColor(selectedTicket.status)}>
                {selectedTicket.status === "in_progress"
                  ? "In Progress"
                  : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Priority:{" "}
                {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(selectedTicket.created_at)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium">Category</h4>
            <p className="flex items-center gap-1.5 text-sm mt-1">
              {selectedTicket.category === "billing" && <FileText className="h-4 w-4" />}
              {selectedTicket.category === "shipping" && <BarChart className="h-4 w-4" />}
              {selectedTicket.category === "technical" && <HelpCircle className="h-4 w-4" />}
              {selectedTicket.category === "general" && <MessageCircle className="h-4 w-4" />}
              {selectedTicket.category.charAt(0).toUpperCase() + selectedTicket.category.slice(1)}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">User ID</h4>
            <p className="text-sm mt-1">{selectedTicket.user_id}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Original Message</h4>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm">
              <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>
          </div>

          {ticketMessages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Message History</h4>
              <div className="space-y-3 mt-2 max-h-[200px] overflow-y-auto">
                {ticketMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-md text-sm ${
                      msg.is_admin ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">
                        {msg.is_admin ? "Support Agent" : "Customer"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium">Reply</h4>
            <div className="mt-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Update Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => handleSupportTicketStatusChange(selectedTicket.id, "open")}
                  className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                >
                  Set as Open
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSupportTicketStatusChange(selectedTicket.id, "in_progress")}
                  className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                >
                  Set as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSupportTicketStatusChange(selectedTicket.id, "resolved")}
                  className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                >
                  Set as Resolved
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSupportTicketStatusChange(selectedTicket.id, "closed")}
                  className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                >
                  Set as Closed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
              >
                {sendingMessage ? "Sending..." : "Send Reply"}
                <Send className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsDialog;
