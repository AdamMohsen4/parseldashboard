
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import MobileNavItem from "./MobileNavItem";

interface Category {
  name: string;
  items: Array<{
    path: string;
    label: string;
    icon?: any;
    subItems?: Array<{
      path: string;
      label: string;
      icon?: any;
    }>;
  }>;
}

interface MobileNavigationProps {
  isOpen: boolean;
  categories: Category[];
  currentPath: string;
  isAdmin: boolean;
  adminDashboardLabel: string;
  onItemClick: () => void;
}

const MobileNavigation = ({
  isOpen,
  categories,
  currentPath,
  isAdmin,
  adminDashboardLabel,
  onItemClick,
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <nav className="md:hidden py-4 space-y-4">
      {/* Add Admin Dashboard Link to Mobile Menu */}
      {isAdmin && (
        <Link
          to="/admin-dashboard"
          className={`flex items-center gap-2 ${
            currentPath === "/admin-dashboard" 
              ? "text-primary font-medium" 
              : "text-foreground"
          } px-2 py-1.5 hover:bg-accent/5 hover:text-primary rounded-md`}
          onClick={onItemClick}
        >
          <Shield className="h-4 w-4" />
          {adminDashboardLabel}
        </Link>
      )}
      
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{category.name}</h3>
          <div className="space-y-1 pl-2">
            {category.items.map((item) => (
              <MobileNavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={currentPath === item.path}
                subItems={item.subItems}
                onItemClick={onItemClick}
              />
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

export default MobileNavigation;
