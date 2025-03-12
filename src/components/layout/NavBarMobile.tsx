
import { Link, useLocation } from "react-router-dom";
import { 
  Shield,
  Package, 
  Warehouse, 
  Truck, 
  FileCheck, 
  LayoutDashboard, 
  Phone, 
  User,
  Briefcase,
  ShoppingCart,
  HelpCircle,
  Users
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import LanguageSwitcher from "../common/LanguageSwitcher";

interface NavBarMobileProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  categories: {
    name: string;
    items: {
      path: string;
      label: string;
      icon: React.ComponentType<any> | null;
      subItems?: {
        path: string;
        label: string;
        icon: React.ComponentType<any>;
      }[];
    }[];
  }[];
  hoverClass: string;
}

const NavBarMobile = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isAdmin, 
  categories, 
  hoverClass 
}: NavBarMobileProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  if (!isMenuOpen) return null;

  return (
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
  );
};

export default NavBarMobile;
