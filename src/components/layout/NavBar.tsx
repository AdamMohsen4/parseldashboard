
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { Menu, Users, Package, Warehouse } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/book", label: t('nav.book') },
    ...(isSignedIn ? [
      { path: "/shipment", label: t('nav.shipment', 'Ship Package'), icon: Package },
      { path: "/3pl", label: t('nav.3pl', '3PL Services'), icon: Warehouse },
      { path: "/tracking", label: t('nav.tracking') },
      { path: "/compliance", label: t('nav.compliance') },
      { path: "/dashboard", label: t('nav.dashboard') },
      { path: "/collaborate", label: t('nav.collaborate', 'Collaborate'), icon: Users },
    ] : []),
  ];

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">E-Parsel</h1>
            </Link>
            <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-0.5 rounded-full">SME Portal</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-primary font-medium"
                    : "text-foreground"
                } hover:text-primary transition-colors flex items-center gap-1`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <AuthButtons />
            </div>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-primary font-medium"
                    : "text-foreground"
                } block py-2 hover:text-primary transition-colors flex items-center gap-1`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-4">
              <LanguageSwitcher />
              <AuthButtons />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
