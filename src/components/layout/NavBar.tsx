
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { Menu, Shield } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavBarItem, NavBarCategory } from "./NavBarItem";
import NavBarMobile from "./NavBarMobile";
import useNavCategories from "./NavBarCategories";

const NavBar = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get navigation categories
  const { categories, isAdmin } = useNavCategories();

  // Updated for sleeker hover style with a subtle background and smooth transition
<<<<<<< HEAD
  const hoverClass = "hover:bg-gray-100/30 hover:text-primary transition-all duration-200 rounded-md";

  // Organize nav items into categories
  const categories = [
    {
      name: t('nav.categories.general', 'General'),
      items: [
        { path: "/", label: t('nav.home'), icon: null },
      ]
    },
    ...(isSignedIn ? [
      {
        name: t('nav.categories.shipping', 'Shipping'),
        items: [
          { 
            path: "/shipment", 
            label: t('nav.shipment', 'Ship Package'), 
            icon: Package,
            subItems: [
              { path: "/shipment/business", label: t('nav.shipment.business', 'Business'), icon: Briefcase},
              { path: "/shipment/private", label: t('nav.shipment.private', 'Private Customer'), icon: User, },
              { path: "/shipment/ecommerce", label: t('nav.shipment.ecommerce', 'E-commerce Business'), icon: ShoppingCart },
            ]

          },
          { path: "/tracking", label: t('nav.tracking'), icon: Truck},
        ]
      },
      {
        name: t('nav.categories.services', 'Services'),
        items: [
          { path: "/3pl", label: t('nav.3pl', '3PL Services'), icon: Warehouse },
          { path: "/compliance", label: t('nav.compliance'), icon: FileCheck },
          { path: "/transportation-partners", label: t('nav.transportationPartners', 'Transportation Partners'), icon: Truck },
          { path: "/book", label: t('nav.book'), icon: Phone },
        ]
      },
      {
        name: t('nav.categories.workspace', 'Workspace'),
        items: [
          { path: "/collaborate", label: t('nav.collaborate', 'Collaborate'), icon: Users },
          { path: "/dashboard", label: t('nav.dashboard'), icon: LayoutDashboard },
          { path: "/support", label: t('nav.support', 'Customer Support'), icon: HelpCircle },
        ]
      }
    ] : [])
  ];
=======
  const hoverClass = "hover:bg-gray-100/30 transition-all duration-200 rounded-md";
>>>>>>> ed6ddc2fe7d9a2829acddc5a56b140ea6b2fce40

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
          
          {/* Admin Dashboard Link - Prominently displayed when admin */}
          {isAdmin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin-dashboard" 
                    className={`hidden md:flex items-center gap-2 ${
                      location.pathname === "/admin-dashboard" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-accent/10 hover:bg-accent/20"
                    } px-3 py-1.5 rounded-md font-medium transition-all duration-200`}
                  >
                    <Shield className="h-4 w-4" />
                    {t('nav.adminDashboard', 'Admin Dashboard')}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Access administrative controls</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              category.name === t('nav.categories.general', 'General') ? (
                // Display General links directly in the navbar
                category.items.map((item) => (
                  <NavBarItem 
                    key={item.path} 
                    item={item} 
                    hoverClass={hoverClass} 
                  />
                ))
              ) : (
                // Use dropdown for other categories
                <NavBarCategory 
                  key={category.name} 
                  category={category} 
                  hoverClass={hoverClass} 
                />
              )
            ))}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <AuthButtons />
            </div>
          </nav>
        </div>

        {/* Mobile navigation */}
        <NavBarMobile 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isAdmin={isAdmin}
          categories={categories}
          hoverClass={hoverClass}
        />
      </div>
    </header>
  );
};

export default NavBar;
