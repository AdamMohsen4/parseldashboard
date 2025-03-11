import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Truck, Ship, Plane, Package } from "lucide-react";

const TransportationPartnersPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('transportation.title', 'Our Transportation Partners')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('transportation.description', 'E-Parsel collaborates with industry-leading transportation companies to ensure reliable and efficient delivery services for all your shipments.')}
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posti">Posti</TabsTrigger>
            <TabsTrigger value="jakeluyhtio">Jakeluyhtio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center">
                      <img 
                        src="/lovable-uploads/4d88d3ca-7d74-4fc7-af8f-849c3eeed233.png" 
                        alt="Posti logo" 
                        className="h-8 w-auto mr-2" 
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>Express Courier Services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Domestic</Badge>
                    <Badge variant="secondary">Same-day Delivery</Badge>
                    <Badge variant="secondary">Express</Badge>
                  </div>
                  <p className="text-sm">
                    Specializing in fast and reliable domestic deliveries with excellent tracking capabilities.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center">
                      <img 
                        src="/lovable-uploads/999aad3b-fea5-47ef-bf42-4541b244b869.png" 
                        alt="Jakeluyhtio logo" 
                        className="h-8 w-auto mr-2" 
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>International Logistics Provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">International</Badge>
                    <Badge variant="secondary">Freight</Badge>
                    <Badge variant="secondary">Customs Clearance</Badge>
                  </div>
                  <p className="text-sm">
                    Global logistics solutions with comprehensive customs handling and international shipping expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-medium mb-4 text-center">Why We Partner with These Companies</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Reliability</h4>
                  <p className="text-sm text-muted-foreground">Consistent delivery performance with excellent service uptime.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Ship className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Global Reach</h4>
                  <p className="text-sm text-muted-foreground">Extensive networks that ensure we can deliver anywhere your business needs.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Technology</h4>
                  <p className="text-sm text-muted-foreground">Advanced tracking and integration capabilities for seamless operations.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="posti" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/4d88d3ca-7d74-4fc7-af8f-849c3eeed233.png" 
                        alt="Posti logo" 
                        className="h-8 w-auto mr-2" 
                      />
                      <span>Transportation Services</span>
                    </CardTitle>
                    <CardDescription>Your trusted partner for domestic deliveries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Company Overview</h3>
                    <p className="text-muted-foreground">
                      Posti is a leading domestic courier service specializing in same-day and next-day deliveries. 
                      With a vast network of couriers and sorting centers, they ensure quick and reliable service throughout the country.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Services Offered</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Same-day delivery for urban centers</li>
                      <li>Next-day delivery nationwide</li>
                      <li>Specialized handling for fragile items</li>
                      <li>Temperature-controlled transport for sensitive goods</li>
                      <li>Proof of delivery with electronic signature</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Coverage Area</h3>
                    <p className="text-muted-foreground mb-2">
                      Posti serves all major cities and rural areas with different service levels:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Zone A - Urban Centers</h4>
                        <p className="text-sm text-muted-foreground">Same-day & next-day guaranteed</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Zone B - Suburban Areas</h4>
                        <p className="text-sm text-muted-foreground">Next-day guaranteed</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Zone C - Rural Towns</h4>
                        <p className="text-sm text-muted-foreground">1-2 day delivery</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Zone D - Remote Areas</h4>
                        <p className="text-sm text-muted-foreground">2-3 day delivery</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Why We Partner With Posti</h3>
                    <p className="text-muted-foreground">
                      Our partnership with Posti allows us to offer exceptional domestic delivery services with 
                      comprehensive tracking, reliable timelines, and excellent customer support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jakeluyhtio" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/999aad3b-fea5-47ef-bf42-4541b244b869.png" 
                        alt="Jakeluyhtio logo" 
                        className="h-8 w-auto mr-2" 
                      />
                      <span>Transportation Services</span>
                    </CardTitle>
                    <CardDescription>Your trusted partner for international deliveries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Company Overview</h3>
                    <p className="text-muted-foreground">
                      Jakeluyhtio is an international logistics provider with decades of experience in global freight operations. 
                      Their extensive network spans over 120 countries, making them an ideal partner for cross-border shipping needs.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Services Offered</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>International air freight</li>
                      <li>Sea freight for bulk shipments</li>
                      <li>Customs clearance and documentation</li>
                      <li>Cross-border e-commerce fulfillment</li>
                      <li>Compliance management for regulated goods</li>
                      <li>Warehousing and distribution services</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Global Presence</h3>
                    <p className="text-muted-foreground mb-2">
                      Jakeluyhtio operates in key markets worldwide with specialized handling for different regions:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">European Markets</h4>
                        <p className="text-sm text-muted-foreground">Comprehensive network with 2-3 day delivery throughout EU</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">North America</h4>
                        <p className="text-sm text-muted-foreground">Strong presence in US and Canada with 3-5 day service</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Asia Pacific</h4>
                        <p className="text-sm text-muted-foreground">Extensive operations in major Asian markets and Oceania</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Middle East</h4>
                        <p className="text-sm text-muted-foreground">Specialized handling for regional requirements</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Africa</h4>
                        <p className="text-sm text-muted-foreground">Growing network with focus on major commercial centers</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">Latin America</h4>
                        <p className="text-sm text-muted-foreground">Strategic partnerships throughout Central and South America</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Why We Partner With Jakeluyhtio</h3>
                    <p className="text-muted-foreground">
                      Our partnership with Jakeluyhtio enables us to provide seamless international shipping solutions with 
                      expert customs handling, reliable documentation, and global reach for businesses of all sizes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TransportationPartnersPage;
