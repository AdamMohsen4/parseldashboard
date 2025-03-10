import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";

const CompliancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Compliance Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Our Compliance Package ensures your shipments meet all regulatory requirements for cross-border shipping within the Nordic region. This service includes all necessary documentation, customs clearance assistance, and ensures adherence to local regulations.
            </p>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Documentation Preparation</h4>
                  <p className="text-sm text-muted-foreground">All required customs and shipping documents prepared on your behalf</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Customs Clearance</h4>
                  <p className="text-sm text-muted-foreground">Expedited customs processing and clearance assistance</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Tax & Duty Calculation</h4>
                  <p className="text-sm text-muted-foreground">Accurate calculation of applicable taxes and duties</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Regulatory Compliance</h4>
                  <p className="text-sm text-muted-foreground">Verification that shipments meet all relevant regulations</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Pricing</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Compliance Package</h4>
                    <p className="text-sm text-muted-foreground">Added to any shipment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">€2.00</p>
                    <p className="text-sm text-muted-foreground">per package</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">When do I need the Compliance Package?</h4>
                  <p className="text-sm text-muted-foreground">It's recommended for all cross-border shipments, especially for commercial goods, but is optional for personal items of low value.</p>
                </div>
                <div>
                  <h4 className="font-medium">Does this guarantee my package won't have customs issues?</h4>
                  <p className="text-sm text-muted-foreground">While it significantly reduces the risk of delays and issues, final decisions rest with customs authorities.</p>
                </div>
                <div>
                  <h4 className="font-medium">How do I add this to my shipment?</h4>
                  <p className="text-sm text-muted-foreground">Simply select the Compliance Package option during the booking process.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link to="/dashboard" className="text-primary hover:underline">
                View Compliance Status in Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompliancePage;
