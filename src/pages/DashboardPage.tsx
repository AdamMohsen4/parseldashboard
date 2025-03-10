import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UploadCloud, FileText, FileSpreadsheet, Package, TrendingUp, Clock, Calendar, ChevronRight } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import { Link } from "react-router-dom";
import FileUploadDialog from "@/components/dashboard/FileUploadDialog";
import DocumentList from "@/components/dashboard/DocumentList";
import { DocumentFile, getDocuments } from "@/services/documentService";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deliveryData = [
    { name: "Jan", onTime: 92, delayed: 8 },
    { name: "Feb", onTime: 88, delayed: 12 },
    { name: "Mar", onTime: 95, delayed: 5 },
    { name: "Apr", onTime: 90, delayed: 10 },
    { name: "May", onTime: 94, delayed: 6 },
    { name: "Jun", onTime: 97, delayed: 3 },
  ];

  const volumeData = [
    { name: "Jan", volume: 120 },
    { name: "Feb", volume: 145 },
    { name: "Mar", volume: 132 },
    { name: "Apr", volume: 167 },
    { name: "May", volume: 178 },
    { name: "Jun", volume: 189 },
  ];

  const shipments = [
    { id: "EP-78945", date: "2023-06-15", from: "Malmö", to: "Helsinki", status: "Delivered", documents: ["invoice.pdf", "customs.pdf"] },
    { id: "EP-78946", date: "2023-06-14", from: "Stockholm", to: "Oslo", status: "In Transit", documents: ["invoice.pdf"] },
    { id: "EP-78947", date: "2023-06-13", from: "Copenhagen", to: "Helsinki", status: "Processing", documents: [] },
    { id: "EP-78948", date: "2023-06-12", from: "Malmö", to: "Stockholm", status: "Delivered", documents: ["invoice.pdf", "customs.pdf"] },
    { id: "EP-78949", date: "2023-06-11", from: "Oslo", to: "Copenhagen", status: "Delivered", documents: ["invoice.pdf"] },
  ];

  useEffect(() => {
    if (activeTab === "documents") {
      loadDocuments();
    }
  }, [activeTab]);

  const loadDocuments = () => {
    setIsLoading(true);
    try {
      const docs = getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const closeUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };

  const handleUploadComplete = () => {
    loadDocuments();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your shipments and view analytics</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button asChild>
              <Link to="/book">New Shipment</Link>
            </Button>
            <Button variant="outline" onClick={openUploadDialog}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-primary mr-2" />
                    <span className="text-2xl font-bold">384</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">↑12%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span className="text-2xl font-bold">93.4%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">↑2.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-primary mr-2" />
                    <span className="text-2xl font-bold">28</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-red-500">↓3</span> from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Next Pickup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-primary mr-2" />
                    <span className="text-2xl font-bold">Today</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scheduled for 14:00
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Your latest 5 shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{shipment.id}</p>
                        <p className="text-sm text-muted-foreground">{shipment.from} to {shipment.to}</p>
                        <p className="text-xs mt-1">{shipment.date}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          shipment.status === "Delivered" ? "bg-green-100 text-green-800" :
                          shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {shipment.status}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">View All Shipments</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>On-time vs delayed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryData} stackOffset="expand">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" stackId="a" name="On Time" fill="#10b981" />
                      <Bar dataKey="delayed" stackId="a" name="Delayed" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment History</CardTitle>
                <CardDescription>View and manage all your shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">Tracking ID</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">From</th>
                        <th scope="col" className="px-6 py-3">To</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b border-border">
                          <td className="px-6 py-4 font-medium">{shipment.id}</td>
                          <td className="px-6 py-4">{shipment.date}</td>
                          <td className="px-6 py-4">{shipment.from}</td>
                          <td className="px-6 py-4">{shipment.to}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              shipment.status === "Delivered" ? "bg-green-100 text-green-800" :
                              shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload and manage your shipping documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    onClick={openUploadDialog}
                  >
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop files here or click to browse
                    </p>
                    <Button onClick={(e) => { e.stopPropagation(); openUploadDialog(); }}>Select Files</Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Supported formats: PDF, CSV, Excel, JPG
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
                    {isLoading ? (
                      <p className="text-center py-4 text-muted-foreground">Loading documents...</p>
                    ) : documents.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No documents found. Upload some documents to get started.</p>
                    ) : (
                      <DocumentList documents={documents} onDelete={loadDocuments} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Volume</CardTitle>
                <CardDescription>Monthly shipping volume trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="volume" name="Shipment Volume" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Destinations</CardTitle>
                  <CardDescription>Most frequent delivery locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p>Helsinki, Finland</p>
                      <span className="font-medium">38%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Stockholm, Sweden</p>
                      <span className="font-medium">29%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "29%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Oslo, Norway</p>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Copenhagen, Denmark</p>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Shipping expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p>Standard Shipping</p>
                      <span className="font-medium">€3,240</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Express Delivery</p>
                      <span className="font-medium">€1,500</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p>Compliance Services</p>
                      <span className="font-medium">€250</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <FileUploadDialog 
        isOpen={isUploadDialogOpen}
        onClose={closeUploadDialog}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default DashboardPage;
