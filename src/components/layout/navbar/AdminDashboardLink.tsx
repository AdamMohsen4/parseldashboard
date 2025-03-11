
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminDashboardLinkProps {
  isAdmin: boolean;
  isActive: boolean;
  label: string;
}

const AdminDashboardLink = ({ isAdmin, isActive, label }: AdminDashboardLinkProps) => {
  if (!isAdmin) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to="/admin-dashboard" 
            className={`hidden md:flex items-center gap-2 ${
              isActive
                ? "bg-primary text-primary-foreground" 
                : "bg-accent/10 hover:bg-accent/15"
            } px-3 py-1.5 rounded-md font-medium transition-colors`}
          >
            <Shield className="h-4 w-4" />
            {label}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Access administrative controls</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminDashboardLink;
