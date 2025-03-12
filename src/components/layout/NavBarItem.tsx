
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<any> | null;
  };
  hoverClass: string;
}

interface NavCategoryProps {
  category: {
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
  };
  hoverClass: string;
}

export const NavBarItem = ({ item, hoverClass }: NavItemProps) => {
  const location = useLocation();
  
  return (
    <Link
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
  );
};

export const NavBarCategory = ({ category, hoverClass }: NavCategoryProps) => {
  const location = useLocation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-1 ${hoverClass} px-2 py-1`}>
        {category.name} <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {category.items.map((item) => (
          item.subItems ? (
            <SubItemDropdown 
              key={item.path} 
              item={item} 
              hoverClass={hoverClass} 
              location={location} 
            />
          ) : (
            <DropdownMenuItem key={item.path} asChild className="hover:bg-gray-100/30 cursor-pointer">
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
  );
};

interface SubItemDropdownProps {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<any> | null;
    subItems: {
      path: string;
      label: string;
      icon: React.ComponentType<any>;
    }[];
  };
  hoverClass: string;
  location: ReturnType<typeof useLocation>;
}

const SubItemDropdown = ({ item, hoverClass, location }: SubItemDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100/30 transition-all duration-200 cursor-default`}>
        <span className="flex items-center gap-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.label}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-48">
        {item.subItems.map((subItem) => (
          <DropdownMenuItem key={subItem.path} asChild className="hover:bg-gray-100/30 cursor-pointer">
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
  );
};

export default NavBarItem;
