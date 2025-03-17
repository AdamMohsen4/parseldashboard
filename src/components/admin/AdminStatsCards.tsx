
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface AdminStatsProps {
  stats: {
    totalShipments: number;
    pendingShipments: number;
    completedShipments: number;
    totalDemoRequests: number;
    // totalCollaborations: number;
    totalSupportTickets: number;
    openSupportTickets: number;
  };
}

const AdminStatsCards: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalShipments}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingShipments}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completed Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedShipments}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.totalShipments > 0
              ? `${Math.round((stats.completedShipments / stats.totalShipments) * 100)}% completion rate`
              : "No shipments recorded"}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Demo Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDemoRequests}</div>
        </CardContent>
      </Card>
{/* 
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Collaborations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCollaborations}</div>
        </CardContent>
      </Card> */}

      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSupportTickets}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Open Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.openSupportTickets}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.totalSupportTickets > 0
              ? `${Math.round((stats.openSupportTickets / stats.totalSupportTickets) * 100)}% open rate`
              : "No support tickets"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsCards;
