
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Logo from "./navbar/Logo";
import AdminDashboardLink from "./navbar/AdminDashboardLink";
import DesktopNavigation from "./navbar/DesktopNavigation";
import MobileNavigation from "./navbar/MobileNavigation";

// Import all the icons used in the navigation
import { 
  Users, 
  Package, 
  Warehouse, 
  Truck, 
  FileCheck, 
  LayoutDashboard, 
  Phone, 
  User,
  Briefcase,
  ShoppingCart,
  HelpCircle
} from "lucide-react";

const NavBar = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // Updated hover style for all navbar items to be more consistent with the rest of the website
  const hoverClass = "hover:bg-accent/5 hover:text-primary transition-colors rounded-md";

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
              { path: "/shipment/business", label: t('nav.shipment.business', 'Business'), icon: Briefcase },
              { path: "/shipment/private", label: t('nav.shipment.private', 'Private Customer'), icon: User },
              { path: "/shipment/ecommerce", label: t('nav.shipment.ecommerce', 'E-commerce Business'), icon: ShoppingCart },
            ]
          },
          { path: "/tracking", label: t('nav.tracking'), icon: Truck },
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

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Admin Dashboard Link - Prominently displayed when admin */}
          <AdminDashboardLink 
            isAdmin={isAdmin} 
            isActive={location.pathname === "/admin-dashboard"}
            label={t('nav.adminDashboard', 'Admin Dashboard')}
          />
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <DesktopNavigation 
            categories={categories}
            currentPath={location.pathname}
            hoverClass={hoverClass}
            isAdmin={isAdmin}
            adminDashboardLabel={t('nav.adminDashboard', 'Admin Dashboard')}
          />
        </div>

        {/* Mobile navigation */}
        <MobileNavigation 
          isOpen={isMenuOpen}
          categories={categories}
          currentPath={location.pathname}
          isAdmin={isAdmin}
          adminDashboardLabel={t('nav.adminDashboard', 'Admin Dashboard')}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default NavBar;
