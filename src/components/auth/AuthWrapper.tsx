
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOwner?: boolean;
}

const AuthWrapper = ({ children, requireAuth = false, requireOwner = false }: AuthWrapperProps) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();
  
  // Check if user has owner role
  const isOwner = isSignedIn && user?.publicMetadata?.role === "owner";

  // If authentication is required but user is not signed in
  if (requireAuth && isLoaded && !isSignedIn) {
    navigate("/");
    return null;
  }
  
  // If owner role is required but user doesn't have it
  if (requireOwner && isLoaded && (!isSignedIn || !isOwner)) {
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
