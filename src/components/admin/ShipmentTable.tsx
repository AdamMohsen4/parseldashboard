
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

interface ShipmentTableProps {
  shipments: any[];
  isLoading: boolean;
  onStatusChange: (shipmentId: string, userId: string, newStatus: string) => Promise<void>;
  getStatusBadgeColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  isLoading,
  onStatusChange,
  getStatusBadgeColor,
  formatDate,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading shipments...</div>;
  }

  if (shipments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No shipments found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Code</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">{shipment.tracking_code || "N/A"}</TableCell>
              <TableCell>
                {shipment.user_id ? shipment.user_id.substring(0, 8) + "..." : "N/A"}
              </TableCell>
              <TableCell>{shipment.pickup_address || "N/A"}</TableCell>
              <TableCell>{shipment.delivery_address || "N/A"}</TableCell>
              <TableCell>{formatDate(shipment.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(shipment.status)}>
                  {shipment.status?.replace(/_/g, " ") || "Unknown"}
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
                      onClick={() => onStatusChange(shipment.id, shipment.user_id, "pending")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(shipment.id, shipment.user_id, "picked_up")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Picked Up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(shipment.id, shipment.user_id, "in_transit")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as In Transit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(shipment.id, shipment.user_id, "delivered")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(shipment.id, shipment.user_id, "exception")}
                      className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer"
                    >
                      Set as Exception
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

export default ShipmentTable;
