
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

interface SubItemType {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface NavItemType {
  path: string;
  label: string;
  icon: React.ComponentType<any> | null;
  subItems?: SubItemType[];
}

interface NavItemProps {
  item: NavItemType;
  navItemClass: string;
  isDropdownItem?: boolean;
}

interface NavCategoryProps {
  category: {
    name: string;
    items: NavItemType[];
  };
  navItemClass: string;
  dropdownItemClass: string;
}

interface SubItemDropdownProps {
  item: NavItemType & { subItems: SubItemType[] };
  navItemClass: string;
  dropdownItemClass: string;
  location: ReturnType<typeof useLocation>;
}

export const NavBarItem = ({ item, navItemClass, isDropdownItem = false }: NavItemProps) => {
  const location = useLocation();
  
  return (
    <Link
      to={item.path}
      className={`${
        location.pathname === item.path
          ? "text-primary font-medium"
          : "text-foreground"
      } ${navItemClass} px-2 py-1 flex items-center gap-1`}
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      {item.label}
    </Link>
  );
};

export const NavBarCategory = ({ category, navItemClass, dropdownItemClass }: NavCategoryProps) => {
  const location = useLocation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-1 ${navItemClass} px-2 py-1`}>
        {category.name} <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {category.items.map((item) => (
          item.subItems ? (
            <SubItemDropdown 
              key={item.path} 
              item={{ ...item, subItems: item.subItems } as NavItemType & { subItems: SubItemType[] }}
              navItemClass={navItemClass}
              dropdownItemClass={dropdownItemClass}
              location={location} 
            />
          ) : (
            <DropdownMenuItem key={item.path} asChild className={dropdownItemClass}>
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

const SubItemDropdown = ({ item, navItemClass, dropdownItemClass, location }: SubItemDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`w-full flex items-center justify-between px-2 py-1.5 text-sm transition-all duration-200 cursor-pointer`}>
        <span className="flex items-center gap-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.label}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-48">
        {item.subItems.map((subItem) => (
          <DropdownMenuItem key={subItem.path} asChild className={dropdownItemClass}>
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
