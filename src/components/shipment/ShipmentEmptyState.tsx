
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

const ShipmentEmptyState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-medium text-lg mb-2">{t("emptyState.noShipments", "No shipments yet")}</h3>
      <p className="text-muted-foreground mb-4">{t("emptyState.bookYourFirst", "Book your first shipment to get started")}</p>
      <Button asChild>
        <Link to="/shipment">{t("emptyState.bookShipment", "Book a Shipment")}</Link>
      </Button>
    </div>
  );
};

export default ShipmentEmptyState;
