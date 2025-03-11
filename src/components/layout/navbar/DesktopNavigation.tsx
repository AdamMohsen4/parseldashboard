
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NavItem from "./NavItem";
import DropdownNavItem from "./DropdownNavItem";

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

interface DesktopNavigationProps {
  categories: Category[];
  currentPath: string;
  hoverClass: string;
  isAdmin: boolean;
  adminDashboardLabel: string;
}

const DesktopNavigation = ({
  categories,
  currentPath,
  hoverClass,
  isAdmin,
  adminDashboardLabel,
}: DesktopNavigationProps) => {
  const { t } = useTranslation();
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {categories.map((category) => (
        category.name === t('nav.categories.general', 'General') ? (
          // Display General links directly in the navbar
          category.items.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={currentPath === item.path}
              hoverClass={hoverClass}
            />
          ))
        ) : (
          // Use dropdown for other categories
          <DropdownNavItem 
            key={category.name} 
            category={category} 
            hoverClass={hoverClass}
            currentPath={currentPath}
          />
        )
      ))}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <AuthButtons />
      </div>
    </nav>
  );
};

export default DesktopNavigation;
