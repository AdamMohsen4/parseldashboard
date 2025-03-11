import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Package, Shield, LineChart, CheckCircle, Truck, Map } from "lucide-react";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import ImageCarousel from "@/components/home/ImageCarousel";

const Index = () => {
  const { isSignedIn } = useUser();
  const { t } = useTranslation();
  
  // Carousel images data
  const carouselImages = [
    {
      src: "uploads/40bf477a-ad0b-486e-9a0d-83c1aff0401a.png",
      alt: "E-Parcel Logistics Facility",
      title: t('home.carousel.logistics.title', 'State-of-the-Art Logistics'),
      description: t('home.carousel.logistics.description', 'Our modern facilities enable seamless shipping and handling of your parcels.')
    },
    {
      src: "uploads/7326fca2-a314-40a0-8acb-41c65a241827.jpg",
      alt: "Delivery Service",
      title: t('home.carousel.delivery.title', 'Fast & Reliable Delivery'),
      description: t('home.carousel.delivery.description', 'Experienced drivers ensuring your packages arrive on time, every time.')
    },
    {
      src: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55",
      alt: "Warehouse Operations",
      title: t('home.carousel.warehouse.title', 'Efficient Warehouse Operations'),
      description: t('home.carousel.warehouse.description', 'Advanced technology and skilled staff to handle your inventory needs.')
    }
  ];
  
  return <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm mb-2">
                {t('home.hero.badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('home.hero.description')}
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                <Button size="lg" className="group animate-slide-in-right" asChild>
                  <Link to="/book" className="mx-0">
                    {t('home.hero.bookButton')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {isSignedIn ? <Button size="lg" variant="outline" className="animate-slide-in-right [animation-delay:100ms]" asChild>
                    <Link to="/dashboard">{t('home.hero.viewDashboard')}</Link>
                  </Button> : <Button size="lg" variant="outline" className="animate-slide-in-right [animation-delay:100ms]" onClick={() => document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click()}>
                    {t('common.signIn')}
                  </Button>}
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-2xl animate-fade-in">
              <ImageCarousel 
                images={carouselImages}
                autoSlideInterval={6000}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section - NEW */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 animate-fade-in [animation-delay:100ms]">
              <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('home.benefits.reliable.title')}</h3>
                <p className="text-muted-foreground">{t('home.benefits.reliable.description')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in [animation-delay:200ms]">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('home.benefits.fast.title')}</h3>
                <p className="text-muted-foreground">{t('home.benefits.fast.description')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in [animation-delay:300ms]">
              <div className="bg-primary/10 p-3 rounded-full">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('home.benefits.coverage.title')}</h3>
                <p className="text-muted-foreground">{t('home.benefits.coverage.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-primary animate-fade-in [animation-delay:100ms] px-0">
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{t('home.features.fixedRate.title')}</CardTitle>
                <CardDescription>{t('home.features.fixedRate.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.fixedRate.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-primary animate-fade-in [animation-delay:200ms]">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{t('home.features.tracking.title')}</CardTitle>
                <CardDescription>{t('home.features.tracking.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.tracking.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-primary animate-fade-in [animation-delay:300ms]">
              <CardHeader>
                <LineChart className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{t('home.features.dashboard.title')}</CardTitle>
                <CardDescription>{t('home.features.dashboard.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.dashboard.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Carousel Section - NEW */}
      <section className="py-16 px-4 bg-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {t('home.showcase.title', 'Our Service in Action')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.showcase.description', 'See how we help businesses and individuals with their logistics needs')}
            </p>
          </div>
          
          <ImageCarousel 
            images={[
              {
                src: "https://images.unsplash.com/photo-1543701863-ca3207a4662b",
                alt: "Shipping and Logistics",
                title: t('home.showcase.shipping.title', 'Global Shipping Network'),
                description: t('home.showcase.shipping.description', 'Connected to major shipping routes worldwide')
              },
              {
                src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7",
                alt: "Warehouse Technology",
                title: t('home.showcase.warehouse.title', 'Smart Warehouse Technology'),
                description: t('home.showcase.warehouse.description', 'Using AI and automation for efficient operations')
              },
              {
                src: "https://images.unsplash.com/photo-1573030889348-c6b0f8b15e40",
                alt: "Sustainable Packaging",
                title: t('home.showcase.sustainable.title', 'Eco-Friendly Solutions'),
                description: t('home.showcase.sustainable.description', 'Committed to reducing our environmental impact')
              }
            ]}
            autoSlideInterval={5000}
            className="rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Card className="p-8 shadow-lg animate-fade-in border-none bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <Button size="lg" className="group animate-scale-in" asChild>
              <Link to="/book">
                {t('home.cta.button')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Partners Carousel section */}
      <section className="py-16">
        <PartnersCarousel speed={45} />
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">E-Parsel</h3>
              <p className="text-muted-foreground">{t('footer.description')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2">
                <li><Link to="/book" className="text-muted-foreground hover:text-primary">{t('nav.book')}</Link></li>
                {isSignedIn && <>
                    <li><Link to="/tracking" className="text-muted-foreground hover:text-primary">{t('nav.tracking')}</Link></li>
                    <li><Link to="/compliance" className="text-muted-foreground hover:text-primary">{t('nav.compliance')}</Link></li>
                    <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary">{t('nav.dashboard')}</Link></li>
                  </>}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">{t('footer.about')}</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">{t('footer.contact')}</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary">{t('footer.terms')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
              <address className="not-italic text-muted-foreground">
                <p>{t('footer.contactInfo.email')} info@e-parsel.com</p>
                <p>{t('footer.contactInfo.phone')} +46 123 456 789</p>
                <p>{t('footer.contactInfo.address')} Malmö, Sweden</p>
              </address>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} E-Parsel. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
