
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import ShipmentBookingPage from "./pages/ShipmentBookingPage";
import TrackingPage from "./pages/TrackingPage";
import CompliancePage from "./pages/CompliancePage";
import CollaboratePage from "./pages/CollaboratePage";
import BookingPage from "./pages/BookingPage";
import SupportPage from "./pages/SupportPage";
import ThreePLServicePage from "./pages/ThreePLServicePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EcommerceIntegrationPage from "./pages/EcommerceIntegrationPage";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import "./i18n";

// Check for the Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Clerk-protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 text-xl font-bold">
          Missing Publishable Key
        </h1>
        <p className="text-gray-700">
          Add your Clerk publishable key to the .env file to enable authentication.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shipment" element={<ShipmentBookingPage />} />
          <Route path="/shipment/:customerType" element={<ShipmentBookingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/three-pl" element={<ThreePLServicePage />} />
          <Route path="/ecommerce-integration" element={<EcommerceIntegrationPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tracking" 
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
