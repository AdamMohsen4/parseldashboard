
import { Link, useLocation } from "react-router-dom";
import { 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface DropdownNavItemProps {
  path: string;
  label: string;
  icon: React.ComponentType<any> | null;
  onClick?: () => void;
  dropdownItemClass: string;
}

const DropdownNavItem = ({ 
  path, 
  label, 
  icon: Icon, 
  onClick,
  dropdownItemClass
}: DropdownNavItemProps) => {
  const location = useLocation();
  
  return (
    <DropdownMenuItem asChild className={`${dropdownItemClass} hover:bg-transparent`}>
      <Link
        to={path}
        className={`${
          location.pathname === path ? "text-primary font-medium" : ""
        } w-full flex items-center gap-2 px-2 py-1`}
        onClick={onClick}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </Link>
    </DropdownMenuItem>
  );
};

export default DropdownNavItem;
