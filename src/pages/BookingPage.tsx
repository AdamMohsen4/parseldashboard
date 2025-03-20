
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { SignInButton } from "@clerk/clerk-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const BookingPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    preferredDate: "",
    message: "",
    demoType: "personal" // default value
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('demo_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          preferred_date: formData.preferredDate || null,
          message: formData.message || null,
          demo_type: formData.demoType || null
        });

      if (error) throw error;

      toast({
        title: "Demo Request Submitted",
        description: "We've received your request and will contact you soon.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        preferredDate: "",
        message: "",
        demoType: "personal"
      });
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Book a Demo with E-Parcel
          </h1>
          <p className="text-xl text-muted-foreground">
            Experience how our platform can simplify your shipping process
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="pb-2">
              <CardTitle>Why Choose E-Parcel</CardTitle>
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
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Your full name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      placeholder="Your company name" 
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Demo Date</Label>
                  <Input 
                    id="preferredDate" 
                    name="preferredDate" 
                    type="date" 
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demoType">Demo Type</Label>
                  <select 
                    id="demoType" 
                    name="demoType" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.demoType}
                    onChange={handleChange}
                  >
                    <option value="personal">Personal Demo</option>
                    <option value="group">Group Demo</option>
                    <option value="technical">Technical Integration Demo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Tell us about your specific needs or questions..."
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  size="lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Schedule Your Demo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
