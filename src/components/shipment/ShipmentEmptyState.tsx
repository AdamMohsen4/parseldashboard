
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const ShipmentEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-medium text-lg mb-2">No shipments yet</h3>
      <p className="text-muted-foreground mb-4">Book your first shipment to get started</p>
      <Button asChild>
        <Link to="/shipment">Book a Shipment</Link>
      </Button>
    </div>
  );
};

export default ShipmentEmptyState;
