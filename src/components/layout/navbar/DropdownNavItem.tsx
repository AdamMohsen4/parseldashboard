
import { Link } from "react-router-dom";
import { LucideIcon, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface SubNavItem {
  path: string;
  label: string;
  icon?: LucideIcon;
}

interface NavItemWithSubItems {
  path: string;
  label: string;
  icon?: LucideIcon;
  subItems?: SubNavItem[];
}

interface DropdownNavItemProps {
  category: {
    name: string;
    items: NavItemWithSubItems[];
  };
  hoverClass: string;
  currentPath: string;
}

const DropdownNavItem = ({ category, hoverClass, currentPath }: DropdownNavItemProps) => {
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
            // For items with subcategories
            <DropdownMenu key={item.path}>
              <DropdownMenuTrigger className={`w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent/5 hover:text-primary cursor-default`}>
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-48">
                {item.subItems.map((subItem) => (
                  <DropdownMenuItem key={subItem.path} asChild className="hover:bg-accent/5 hover:text-primary cursor-pointer">
                    <Link
                      to={subItem.path}
                      className={`${
                        currentPath === subItem.path ? "text-primary font-medium" : ""
                      } w-full flex items-center gap-2 px-2 py-1`}
                    >
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      {subItem.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // For regular items
            <DropdownMenuItem key={item.path} asChild className="hover:bg-accent/5 hover:text-primary cursor-pointer">
              <Link
                to={item.path}
                className={`${
                  currentPath === item.path ? "text-primary font-medium" : ""
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

export default DropdownNavItem;
