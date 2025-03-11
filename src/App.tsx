
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkLoaded, useUser } from "@clerk/clerk-react";
import AuthWrapper from "./components/auth/AuthWrapper";
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import ShipmentBookingPage from "./pages/ShipmentBookingPage";
import ThreePLServicePage from "./pages/ThreePLServicePage";
import TrackingPage from "./pages/TrackingPage";
import CompliancePage from "./pages/CompliancePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CollaboratePage from "./pages/CollaboratePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  
  // Log authentication state for debugging
  if (isLoaded) {
    console.log("Protected route:", { 
      isSignedIn, 
      userRole: user?.publicMetadata?.role || "none",
      requireAdmin
    });
  }
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  
  // Check if admin role is required and user has it
  if (requireAdmin && user?.publicMetadata?.role !== "admin") {
    console.log("Admin required but user has role:", user?.publicMetadata?.role);
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="">
        <ClerkLoaded>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<BookingPage />} />
            
            {/* Protected routes */}
            <Route path="/shipment" element={
              <ProtectedRoute>
                <ShipmentBookingPage />
              </ProtectedRoute>
            } />
            <Route path="/3pl" element={
              <ProtectedRoute>
                <ThreePLServicePage />
              </ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            } />
            <Route path="/compliance" element={
              <ProtectedRoute>
                <CompliancePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/collaborate" element={
              <ProtectedRoute>
                <CollaboratePage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
