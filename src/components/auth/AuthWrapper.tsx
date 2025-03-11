
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AuthWrapper = ({ children, requireAuth = false, requireAdmin = false }: AuthWrapperProps) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();
  
  // Check if user has admin role
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // If authentication is required but user is not signed in
  if (requireAuth && isLoaded && !isSignedIn) {
    navigate("/");
    return null;
  }
  
  // If admin role is required but user doesn't have it
  if (requireAdmin && isLoaded && (!isSignedIn || !isAdmin)) {
    navigate("/dashboard");
    return null;
  }

  return <>{children}</>;
};

export const AuthButtons = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
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
