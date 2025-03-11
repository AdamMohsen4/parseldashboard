import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Package, Shield, LineChart, CheckCircle, Truck, Map } from "lucide-react";
import PartnersCarousel from "@/components/home/PartnersCarousel";

const Index = () => {
  const { isSignedIn } = useUser();
  const { t } = useTranslation();
  
  return <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero section with gradient overlay */}
      <section className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[url('/uploads/40bf477a-ad0b-486e-9a0d-83c1aff0401a.png')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                {t('home.hero.badge')}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {t('home.hero.title')}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="group text-lg h-14 px-8 animate-slide-in-right shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow" asChild>
                  <Link to="/book">
                    {t('home.hero.bookButton')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {isSignedIn ? (
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 animate-slide-in-right [animation-delay:100ms]" asChild>
                    <Link to="/dashboard">{t('home.hero.viewDashboard')}</Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg h-14 px-8 animate-slide-in-right [animation-delay:100ms]"
                    onClick={() => document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click()}
                  >
                    {t('common.signIn')}
                  </Button>
                )}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
              <img 
                alt="E-Parcel Logistics Facility" 
                className="w-full h-auto rounded-2xl transform transition-all duration-700 group-hover:scale-105" 
                src="uploads/40bf477a-ad0b-486e-9a0d-83c1aff0401a.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section with gradient cards */}
      <section className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-white via-white to-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in [animation-delay:100ms]">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.benefits.reliable.title')}</h3>
              <p className="text-muted-foreground">{t('home.benefits.reliable.description')}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-white via-white to-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in [animation-delay:200ms]">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.benefits.fast.title')}</h3>
              <p className="text-muted-foreground">{t('home.benefits.fast.description')}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-white via-white to-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in [animation-delay:300ms]">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.benefits.coverage.title')}</h3>
              <p className="text-muted-foreground">{t('home.benefits.coverage.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section with improved cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('home.features.title')}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-secondary/5 animate-fade-in [animation-delay:100ms]">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t('home.features.fixedRate.title')}</CardTitle>
                <CardDescription>{t('home.features.fixedRate.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.fixedRate.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-secondary/5 animate-fade-in [animation-delay:200ms]">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t('home.features.tracking.title')}</CardTitle>
                <CardDescription>{t('home.features.tracking.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.tracking.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-secondary/5 animate-fade-in [animation-delay:300ms]">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{t('home.features.dashboard.title')}</CardTitle>
                <CardDescription>{t('home.features.dashboard.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="group-hover:text-primary transition-colors">{t('home.features.dashboard.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section with glassmorphism */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Card className="p-12 shadow-xl animate-fade-in border-none bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <Button size="lg" className="group text-lg h-14 px-8 animate-scale-in shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow" asChild>
              <Link to="/book">
                {t('home.cta.button')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Partners section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <PartnersCarousel speed={45} />
      </section>

      {/* Footer with improved styling */}
      <footer className="bg-secondary/10 py-16">
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
