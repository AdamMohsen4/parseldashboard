
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { 
  Menu, 
  Shield
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
import useNavCategories from "./NavBarCategories";
import { NavBarItem, NavBarCategory } from "./NavBarItem";
import NavBarMobile from "./NavBarMobile";

const NavBar = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // Separate styles for primary navigation and dropdown items
  const navItemClass = "transition-all duration-200 rounded-md"; // Just transitions, no hover effects
  const dropdownItemClass = "hover:bg-gray-100/30 cursor-pointer";
  
  // Get navigation categories
  const { categories } = useNavCategories();

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">E-Parcel</h1>
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
                    navItemClass={navItemClass} 
                  />
                ))
              ) : (
                // Use dropdown for other categories
                <NavBarCategory 
                  key={category.name} 
                  category={category} 
                  navItemClass={navItemClass}
                  dropdownItemClass={dropdownItemClass}
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
          hoverClass={navItemClass}
        />
      </div>
    </header>
  );
};

export default NavBar;
