
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { Menu, Users, Package, Warehouse, ChevronDown, Truck, FileCheck, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Organize nav items into categories
  const categories = [
    {
      name: t('nav.categories.general', 'General'),
      items: [
        { path: "/", label: t('nav.home'), icon: null },
        { path: "/book", label: t('nav.book'), icon: null },
      ]
    },
    ...(isSignedIn ? [
      {
        name: t('nav.categories.shipping', 'Shipping'),
        items: [
          { path: "/shipment", label: t('nav.shipment', 'Ship Package'), icon: Package },
          { path: "/tracking", label: t('nav.tracking'), icon: Truck },
        ]
      },
      {
        name: t('nav.categories.services', 'Services'),
        items: [
          { path: "/3pl", label: t('nav.3pl', '3PL Services'), icon: Warehouse },
          { path: "/compliance", label: t('nav.compliance'), icon: FileCheck },
        ]
      },
      {
        name: t('nav.categories.workspace', 'Workspace'),
        items: [
          { path: "/dashboard", label: t('nav.dashboard'), icon: LayoutDashboard },
          { path: "/collaborate", label: t('nav.collaborate', 'Collaborate'), icon: Users },
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
                    } hover:text-primary transition-colors flex items-center gap-1`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))
              ) : (
                // Use dropdown for other categories
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
                    {category.name} <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {category.items.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={`${
                            location.pathname === item.path ? "text-primary font-medium" : ""
                          } w-full flex items-center gap-2`}
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
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
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{category.name}</h3>
                <div className="space-y-1 pl-2">
                  {category.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${
                        location.pathname === item.path
                          ? "text-primary font-medium"
                          : "text-foreground"
                      } block py-1.5 hover:text-primary transition-colors flex items-center gap-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
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
