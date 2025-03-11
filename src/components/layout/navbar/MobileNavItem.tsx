
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SubNavItem {
  path: string;
  label: string;
  icon?: LucideIcon;
}

interface MobileNavItemProps {
  path: string;
  label: string;
  icon?: LucideIcon | null;
  isActive: boolean;
  subItems?: SubNavItem[];
  onItemClick: () => void;
}

const MobileNavItem = ({ 
  path, 
  label, 
  icon: Icon, 
  isActive, 
  subItems, 
  onItemClick 
}: MobileNavItemProps) => {
  if (subItems) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 py-1.5">
          {Icon && <Icon className="h-4 w-4" />}
          <span className="font-medium">{label}</span>
        </div>
        <div className="pl-6 space-y-1">
          {subItems.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={`${
                isActive && path === subItem.path
                  ? "text-primary font-medium"
                  : "text-foreground"
              } block py-1.5 hover:bg-accent/5 hover:text-primary flex items-center gap-2 px-2 rounded-md`}
              onClick={onItemClick}
            >
              {subItem.icon && <subItem.icon className="h-4 w-4" />}
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={path}
      className={`${
        isActive ? "text-primary font-medium" : "text-foreground"
      } block py-1.5 hover:bg-accent/5 hover:text-primary flex items-center gap-2 px-2 rounded-md`}
      onClick={onItemClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
};

export default MobileNavItem;
