
import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "@/components/layout/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EcommerceIntegrationButton from "@/components/three-pl/EcommerceIntegrationButton";
import { Button } from "@/components/ui/button";
import { CheckCircle, Code, Package, RefreshCcw, Globe, ShoppingCart } from "lucide-react";

const EcommerceIntegrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>E-commerce Integration | E-Parsel</title>
      </Helmet>
      <NavBar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary font-medium px-4 py-2 rounded-full mb-4">
              E-commerce Solutions
            </div>
            <h1 className="text-4xl font-bold mb-4">Integrate E-Parsel with Your Store</h1>
            <p className="text-xl text-muted-foreground">
              Add a "Ship with E-Parsel" button to your checkout process and offer seamless shipping to your customers.
            </p>
          </div>
          
          <Tabs defaultValue="integration" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integration">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Integration Button</CardTitle>
                  <CardDescription>
                    Customize your "Ship with E-Parsel" button and get the code to add to your website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EcommerceIntegrationButton />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Documentation</CardTitle>
                  <CardDescription>
                    Learn how to integrate E-Parsel into your e-commerce platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Getting Started</h3>
                    <p>
                      Integrating E-Parsel with your e-commerce platform is simple. Just add our script to your website and place the button where you want it to appear.
                    </p>
                    
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-2">Basic Integration</h4>
                      <pre className="text-sm overflow-x-auto p-2">
                        {`<script src="https://cdn.e-parsel.com/integration.js" 
  data-store-id="YOUR_STORE_ID">
</script>`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configuration Options</h3>
                    <p>
                      You can customize the appearance and behavior of the E-Parsel integration.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Option</th>
                            <th className="text-left py-2 px-4">Default</th>
                            <th className="text-left py-2 px-4">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">buttonType</td>
                            <td className="py-2 px-4">"button"</td>
                            <td className="py-2 px-4">Type of integration: "button", "link", or "script"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">buttonVariant</td>
                            <td className="py-2 px-4">"dark"</td>
                            <td className="py-2 px-4">Button appearance: "dark" or "light"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">buttonSize</td>
                            <td className="py-2 px-4">"medium"</td>
                            <td className="py-2 px-4">Button size: "small", "medium", or "large"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">buttonLabel</td>
                            <td className="py-2 px-4">"Ship with E-Parsel"</td>
                            <td className="py-2 px-4">Text displayed on the button</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">includeIcon</td>
                            <td className="py-2 px-4">true</td>
                            <td className="py-2 px-4">Whether to show the E-Parsel icon</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">API Reference</h3>
                    <p>
                      The E-Parsel integration exposes a JavaScript API for advanced usage.
                    </p>
                    
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-2">Available Methods</h4>
                      <pre className="text-sm overflow-x-auto p-2">
{`// Initialize with custom options
window.EParsel.init({
  buttonType: "button",
  buttonVariant: "dark",
  buttonSize: "medium",
  buttonLabel: "Ship with E-Parsel",
  includeIcon: true
});

// Create a shipment programmatically
window.EParsel.createShipment({
  orderId: "123",
  pickup: "Your warehouse address",
  delivery: "Customer address",
  weight: "1", // kg
  dimensions: { length: "20", width: "15", height: "10" } // cm
});

// Listen for events
window.EParsel.on("shipment-created", function(data) {
  console.log("Shipment created:", data);
});`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform-Specific Integrations</CardTitle>
                    <CardDescription>
                      Ready-to-use integration guides for popular e-commerce platforms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-2 hover:border-primary transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Shopify
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add E-Parsel to your Shopify store checkout in minutes.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">View Guide</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 hover:border-primary transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            WooCommerce
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Integrate with your WordPress WooCommerce store.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">View Guide</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 hover:border-primary transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Magento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add E-Parsel shipping to your Magento checkout.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">View Guide</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 hover:border-primary transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Custom Integration
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Advanced guide for custom e-commerce platforms.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">View Guide</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Live Demo</CardTitle>
                    <CardDescription>
                      See how the E-Parsel button looks and works in a real checkout flow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span>Product Total</span>
                          <span>€45.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>€8.00</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total</span>
                          <span>€53.00</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-4">
                        <Button className="w-full">Complete Checkout</Button>
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <span className="relative bg-background px-2 text-sm text-muted-foreground">
                            or
                          </span>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 h-10 py-2 px-4 bg-gray-900 text-white rounded-md text-sm font-medium transition-colors">
                          <Package className="h-4 w-4" />
                          Ship with E-Parsel
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-primary/5 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Easy Integration</h3>
              <p className="text-muted-foreground">
                Add just a few lines of code to your website to enable E-Parsel shipping.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-primary/5 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <RefreshCcw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Real-time Syncing</h3>
              <p className="text-muted-foreground">
                Shipments created through your store are instantly available in your E-Parsel dashboard.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-primary/5 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Works Everywhere</h3>
              <p className="text-muted-foreground">
                Compatible with all major e-commerce platforms and custom websites.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Create your account and get your store ID to start integrating E-Parsel today.
            </p>
            <Button size="lg" className="px-8">Sign Up for Free</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceIntegrationPage;
