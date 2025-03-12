
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-react";
import {
  Users, 
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
  WarehouseIcon
} from "lucide-react";

type NavItemType = {
  path: string;
  label: string;
  icon: React.ComponentType<any> | null;
  subItems?: {
    path: string;
    label: string;
    icon: React.ComponentType<any>;
  }[];
};

type CategoryType = {
  name: string;
  items: NavItemType[];
};

const useNavCategories = () => {
  const { isSignedIn, user } = useUser();
  const { t } = useTranslation();
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // Organize nav items into categories
  const categories: CategoryType[] = [
    {
      name: t('nav.categories.general', 'General'),
      items: [
        { path: "/", label: t('nav.home'), icon: null },
      ]
    },
    ...(isSignedIn ? [
      {
        name: t('nav.categories.shipping', 'Shipping'),
        items: [
          { 
            path: "/shipment", 
            label: t('nav.shipment', 'Ship Package'), 
            icon: Package,
            subItems: [
              { path: "/shipment/business", label: t('nav.shipment.business', 'Business'), icon: Briefcase },
              { path: "/shipment/private", label: t('nav.shipment.private', 'Private Customer'), icon: User },
              { path: "/shipment/ecommerce", label: t('nav.shipment.ecommerce', 'E-commerce Business'), icon: ShoppingCart },
            ]
          },
          { path: "/tracking", label: t('nav.tracking'), icon: Truck },
        ]
      },
      {
        name: t('nav.categories.services', 'Services'),
        items: [
          { path: "/3pl", label: t('nav.3pl', '3PL Services'), icon: Package},
          { path: "/warehouse", label: t('nav.warehouse', 'Warehouse Marketplace'), icon: Warehouse },
          { path: "/compliance", label: t('nav.compliance'), icon: FileCheck },
          { path: "/transportation-partners", label: t('nav.transportationPartners', 'Transportation Partners'), icon: Truck },
          { path: "/book", label: t('nav.book'), icon: Phone },
        ]
      },
      {
        name: t('nav.categories.workspace', 'Workspace'),
        items: [
          { path: "/collaborate", label: t('nav.collaborate', 'Collaborate'), icon: Users },
          { path: "/dashboard", label: t('nav.dashboard'), icon: LayoutDashboard },
          { path: "/support", label: t('nav.support', 'Customer Support'), icon: HelpCircle },
        ]
      }
    ] : [])
  ];

  return { categories, isAdmin };
};

export default useNavCategories;
