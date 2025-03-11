import { useUser, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AuthWrapper = ({ children, requireAuth = false, requireAdmin = false }: AuthWrapperProps) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // Set auth header for Supabase when user is authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      // Get the JWT token from Clerk
      getToken({ template: "supabase" }).then((token) => {
        // Set the auth token in Supabase
        supabase.auth.setSession({ 
          access_token: token as string, 
          refresh_token: ''
        });
        console.log("Supabase auth token set from Clerk");
      });
    } else {
      // Clear the Supabase session when not signed in
      supabase.auth.signOut();
    }
  }, [isSignedIn, user, getToken]);

  // Log auth status for debugging
  useEffect(() => {
    if (isLoaded) {
      console.log("Auth state:", { 
        isSignedIn, 
        isAdmin, 
        userRole: user?.publicMetadata?.role || "none",
        requireAuth,
        requireAdmin
      });
    }
  }, [isLoaded, isSignedIn, isAdmin, requireAuth, requireAdmin, user]);

  // If authentication is required but user is not signed in
  if (requireAuth && isLoaded && !isSignedIn) {
    console.log("User not signed in, redirecting to home");
    navigate("/");
    return null;
  }
  
  // If admin role is required but user doesn't have it
  if (requireAdmin && isLoaded && (!isSignedIn || !isAdmin)) {
    console.log("Admin access required but user is not admin, redirecting to dashboard");
    
    // Show a toast message to explain the redirection
    if (isSignedIn) {
      toast({
        title: "Admin Access Required",
        description: "You need admin privileges to access this page. Current role: " + 
                    (user?.publicMetadata?.role || "undefined"),
        variant: "destructive",
      });
    }
    
    navigate("/dashboard");
    return null;
  }

  return <>{children}</>;
};

export const AuthButtons = () => {
  const { isSignedIn, user } = useUser();
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            Admin
          </span>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <SignInButton>
        <Button variant="outline">Login</Button>
      </SignInButton>
      <SignUpButton>
        <Button>Sign Up</Button>
      </SignUpButton>
    </div>
  );
};

export default AuthWrapper;
