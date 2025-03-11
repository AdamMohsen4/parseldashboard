
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { 
  Menu, 
  Users, 
  Package, 
  Warehouse, 
  ChevronDown, 
  Truck, 
  FileCheck, 
  LayoutDashboard, 
  Phone, 
  Shield,
  User,
  Briefcase,
  ShoppingCart,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavBar = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // Updated for sleeker hover style with a subtle background and smooth transition
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
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? "text-primary font-medium"
                        : "text-foreground"
                    } ${hoverClass} px-2 py-1 flex items-center gap-1`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))
              ) : (
                // Use dropdown for other categories
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger className={`flex items-center gap-1 ${hoverClass} px-2 py-1`}>
                    {category.name} <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {category.items.map((item) => (
                      item.subItems ? (
                        // For items with subcategories
                        <DropdownMenu key={item.path}>
                          <DropdownMenuTrigger className={`w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100/30 hover:text-primary transition-all duration-200 cursor-default`}>
                            <span className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              {item.label}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" className="w-48">
                            {item.subItems.map((subItem) => (
                              <DropdownMenuItem key={subItem.path} asChild className="hover:bg-gray-100/30 hover:text-primary transition-all duration-200 cursor-pointer">
                                <Link
                                  to={subItem.path}
                                  className={`${
                                    location.pathname === subItem.path ? "text-primary font-medium" : ""
                                  } w-full flex items-center gap-2 px-2 py-1`}
                                >
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  {subItem.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        // For regular items
                        <DropdownMenuItem key={item.path} asChild className="hover:bg-gray-100/30 hover:text-primary transition-all duration-200 cursor-pointer">
                          <Link
                            to={item.path}
                            className={`${
                              location.pathname === item.path ? "text-primary font-medium" : ""
                            } w-full flex items-center gap-2 px-2 py-1`}
                          >
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      )
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ))}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <AuthButtons />
            </div>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            {/* Add Admin Dashboard Link to Mobile Menu */}
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-2 ${
                  location.pathname === "/admin-dashboard" 
                    ? "text-primary font-medium" 
                    : "text-foreground"
                } px-2 py-1.5 ${hoverClass}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                {t('nav.adminDashboard', 'Admin Dashboard')}
              </Link>
            )}
            
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{category.name}</h3>
                <div className="space-y-1 pl-2">
                  {category.items.map((item) => (
                    item.subItems ? (
                      <div key={item.path} className="space-y-1">
                        <div className="flex items-center gap-2 py-1.5">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`${
                                location.pathname === subItem.path
                                  ? "text-primary font-medium"
                                  : "text-foreground"
                              } block py-1.5 ${hoverClass} flex items-center gap-2 px-2`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${
                          location.pathname === item.path
                            ? "text-primary font-medium"
                            : "text-foreground"
                        } block py-1.5 ${hoverClass} flex items-center gap-2 px-2`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
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
