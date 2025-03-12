
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

type NavItemProps = {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<any> | null;
    subItems?: {
      path: string;
      label: string;
      icon: React.ComponentType<any>;
    }[];
  };
  hoverClass: string;
};

type NavCategoryProps = {
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
};

// Individual navbar item component
export const NavBarItem = ({ item, hoverClass }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const { t } = useTranslation();

  // Check if this item has subitems
  if (item.subItems && item.subItems.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`flex items-center gap-1 px-2 ${isActive ? 'text-primary font-medium' : ''} ${hoverClass}`}
          >
            {item.icon && <item.icon className="h-4 w-4 mr-1" />}
            {item.label}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {item.subItems.map((subItem) => (
            <DropdownMenuItem key={subItem.path} asChild>
              <Link to={subItem.path} className="flex items-center gap-2 w-full">
                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                {subItem.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Regular link with no subitems
  return (
    <Link
      to={item.path}
      className={`px-2 py-1.5 ${isActive ? 'text-primary font-medium' : ''} ${hoverClass} flex items-center`}
    >
      {item.icon && <item.icon className="h-4 w-4 mr-1" />}
      {item.label}
    </Link>
  );
};

// Category section with a dropdown of multiple items
export const NavBarCategory = ({ category, hoverClass }: NavCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex items-center gap-1 px-2 ${hoverClass}`}
        >
          {category.name}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {category.items.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <Link to={item.path} className="flex items-center gap-2 w-full">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
