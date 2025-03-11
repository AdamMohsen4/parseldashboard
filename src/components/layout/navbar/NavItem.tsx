
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  path: string;
  label: string;
  icon?: LucideIcon | null;
  isActive: boolean;
  hoverClass: string;
  onClick?: () => void;
}

const NavItem = ({ path, label, icon: Icon, isActive, hoverClass, onClick }: NavItemProps) => {
  return (
    <Link
      to={path}
      className={`${
        isActive ? "text-primary font-medium" : "text-foreground"
      } ${hoverClass} px-2 py-1 flex items-center gap-1`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
};

export default NavItem;
