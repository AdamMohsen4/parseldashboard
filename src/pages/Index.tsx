
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">ParcelNordic</h1>
            <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-0.5 rounded-full">SME Portal</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/book" className="text-foreground hover:text-primary transition-colors">Book Shipment</Link>
            <Link to="/tracking" className="text-foreground hover:text-primary transition-colors">Tracking</Link>
            <Link to="/compliance" className="text-foreground hover:text-primary transition-colors">Compliance</Link>
          </nav>
          <div>
            <Button variant="outline" className="mr-2">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Simplified Logistics for <span className="text-primary">Small Businesses</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Book, track, and manage your shipments from a single platform at a fixed rate of €10 per parcel.
                Faster than phone calls, simpler than enterprise software.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/book">Book a Shipment</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/tracking">Track a Package</Link>
                </Button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80" 
                alt="Logistics" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ParcelNordic?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We simplify logistics for small and medium enterprises across the Nordic region.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Fixed €10 Rate</CardTitle>
                <CardDescription>Transparent pricing with no hidden fees</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Book shipments to any Nordic destination for a flat €10 rate per parcel. 
                Save up to 30% compared to direct carrier pricing.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>Monitor your shipments 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get live updates on your shipment status with real-time map tracking and 
                automated SMS/email notifications.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>EU Compliance</CardTitle>
                <CardDescription>Stay compliant with regulations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Add compliance features for just €2 extra per shipment. Carbon tracking, 
                ELD integration, and CSRD reporting.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Shipping?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of SMEs across the Nordic region who trust ParcelNordic for their shipping needs.
          </p>
          <Button size="lg" asChild>
            <Link to="/book">Book Your First Shipment</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ParcelNordic</h3>
              <p className="text-muted-foreground">Simplified logistics solutions for SMEs.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/book" className="text-muted-foreground hover:text-primary">Book Shipment</Link></li>
                <li><Link to="/tracking" className="text-muted-foreground hover:text-primary">Tracking</Link></li>
                <li><Link to="/compliance" className="text-muted-foreground hover:text-primary">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <address className="not-italic text-muted-foreground">
                <p>Email: info@parcelnordic.com</p>
                <p>Phone: +46 123 456 789</p>
                <p>Address: Malmö, Sweden</p>
              </address>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ParcelNordic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
