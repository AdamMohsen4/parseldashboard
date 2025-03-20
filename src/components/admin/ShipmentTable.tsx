import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X, Info, Download } from "lucide-react";
import { toast } from "sonner";

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
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-8">Loading shipments...</div>;
  }

  if (shipments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No shipments found</div>;
  }

  const handleViewDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setDetailsOpen(true);
  };

  return (
    <>
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
                  <div className="flex gap-2">

              

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(shipment)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
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
                        <DropdownMenuItem
                          onClick={() => onStatusChange(shipment.id, shipment.user_id, "cancelled")}
                          className="hover:bg-gray-100/40 hover:text-red-500 cursor-pointer"
                        >
                          Set as Cancelled
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Shipment Details</span>
              <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Complete information for this shipment
            </DialogDescription>
          </DialogHeader>

          {selectedShipment && (
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tracking Code: {selectedShipment.tracking_code || "N/A"}</h3>
                <Badge className={getStatusBadgeColor(selectedShipment.status)}>
                  {selectedShipment.status?.replace(/_/g, " ") || "Unknown"}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-muted-foreground">Shipment Information</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p>{selectedShipment.user_id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created At</p>
                      <p>{formatDate(selectedShipment.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p>{selectedShipment.carrier_name || "E-Parsel Nordic"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Type</p>
                      <p className="capitalize">{selectedShipment.customer_type || "Private"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-muted-foreground">Schedule</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Time</p>
                      <p>{selectedShipment.pickup_time || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p>{selectedShipment.estimated_delivery ? new Date(selectedShipment.estimated_delivery).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Speed</p>
                      <p className="capitalize">{selectedShipment.delivery_speed || "Standard"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancellation Deadline</p>
                      <p>{selectedShipment.cancellation_deadline ? formatDate(selectedShipment.cancellation_deadline) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-muted-foreground">Addresses</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Address</p>
                    <p>{selectedShipment.pickup_address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p>{selectedShipment.delivery_address || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-muted-foreground">Package Details</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p>{selectedShipment.weight || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensions (L×W×H)</p>
                    <p>
                      {selectedShipment.dimension_length || "N/A"} × {selectedShipment.dimension_width || "N/A"} × {selectedShipment.dimension_height || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-muted-foreground">Pricing</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Carrier Price</p>
                    <p>{selectedShipment.carrier_price ? `€${parseFloat(selectedShipment.carrier_price).toFixed(2)}` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold">{selectedShipment.total_price ? `€${parseFloat(selectedShipment.total_price).toFixed(2)}` : "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-muted-foreground">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p>{selectedShipment.business_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VAT Number</p>
                    <p>{selectedShipment.vat_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Service</p>
                    <p>{selectedShipment.include_compliance ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Label</p>
                    <p>{selectedShipment.label_url ? "Available" : "Not available"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            {selectedShipment?.label_url && (
              <Button asChild variant="outline">
                <a href={selectedShipment.label_url} target="_blank" rel="noopener noreferrer">
                  Open Shipping Label
                </a>
              </Button>
            )}
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShipmentTable;
