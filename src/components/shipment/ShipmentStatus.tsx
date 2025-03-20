
import React from "react";
import { Shipment } from "@/services/shipmentService";

interface ShipmentStatusProps {
  status: Shipment["status"];
}

export const ShipmentStatus: React.FC<ShipmentStatusProps> = ({ status }) => {
  const getStatusColor = (status: Shipment["status"]) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'picked_up':
        return "bg-blue-100 text-blue-800";
      case 'in_transit':
        return "bg-indigo-100 text-indigo-800";
      case 'delivered':
        return "bg-green-100 text-green-800";
      case 'exception':
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Shipment["status"]) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'exception': return 'Exception';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default ShipmentStatus;
