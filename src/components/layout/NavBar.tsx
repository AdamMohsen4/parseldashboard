
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthWrapper";
import { useUser } from "@clerk/clerk-react";

const NavBar = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-primary">E-Parsel</h1>
          </Link>
          <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-0.5 rounded-full">SME Portal</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/book" 
            className={`${location.pathname === '/book' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors`}
          >
            Book Shipment
          </Link>
          
          {isSignedIn && (
            <>
              <Link 
                to="/tracking" 
                className={`${location.pathname === '/tracking' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors`}
              >
                Tracking
              </Link>
              <Link 
                to="/compliance" 
                className={`${location.pathname === '/compliance' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors`}
              >
                Compliance
              </Link>
              <Link 
                to="/dashboard" 
                className={`${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-foreground'} hover:text-primary transition-colors`}
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>
        
        <AuthButtons />
      </div>
    </header>
  );
};

export default NavBar;
