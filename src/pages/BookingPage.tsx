
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { SignInButton } from "@clerk/clerk-react";

const BookingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Book a Demo with E-Parsel
          </h1>
          <p className="text-xl text-muted-foreground">
            Experience how our platform can simplify your shipping process
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="pb-2">
              <CardTitle>Why Choose E-Parsel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                  <span>1</span>
                </div>
                <div>
                  <h3 className="font-medium">Fixed Pricing</h3>
                  <p className="text-sm text-muted-foreground">Simple, transparent pricing at €10 per parcel</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                  <span>2</span>
                </div>
                <div>
                  <h3 className="font-medium">Simplified Process</h3>
                  <p className="text-sm text-muted-foreground">No more complicated forms or confusing carrier options</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                  <span>3</span>
                </div>
                <div>
                  <h3 className="font-medium">Compliance Built-in</h3>
                  <p className="text-sm text-muted-foreground">Optional compliance package for cross-border shipments</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                  <span>4</span>
                </div>
                <div>
                  <h3 className="font-medium">Real-time Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your shipments with detailed status updates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request a Demo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Our team will walk you through our platform and show you how E-Parsel can save your business time and money.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium">Personal Demo</h3>
                    <p className="text-sm text-muted-foreground">30-minute personalized walkthrough</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium">Live Q&A</h3>
                    <p className="text-sm text-muted-foreground">Get your questions answered</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium">Pricing Consultation</h3>
                    <p className="text-sm text-muted-foreground">Learn about volume discounts</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium">Integration Overview</h3>
                    <p className="text-sm text-muted-foreground">See how we connect to your tools</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex flex-col space-y-4">
                <SignInButton>
                  <Button size="lg" className="w-full">Sign Up to Book a Demo</Button>
                </SignInButton>
                <p className="text-xs text-center text-muted-foreground">
                  Already have an account? Sign in to access the full booking system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
