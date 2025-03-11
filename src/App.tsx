
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
import SupportPage from "./pages/SupportPage";
import IntegrationPage from "./pages/IntegrationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
              <AuthWrapper requireAuth>
                <ShipmentBookingPage />
              </AuthWrapper>
            } />
            <Route path="/shipment/business" element={
              <AuthWrapper requireAuth>
                <ShipmentBookingPage customerType="business" />
              </AuthWrapper>
            } />
            <Route path="/shipment/private" element={
              <AuthWrapper requireAuth>
                <ShipmentBookingPage customerType="private" />
              </AuthWrapper>
            } />
            <Route path="/shipment/ecommerce" element={
              <AuthWrapper requireAuth>
                <ShipmentBookingPage customerType="ecommerce" />
              </AuthWrapper>
            } />
            <Route path="/3pl" element={
              <AuthWrapper requireAuth>
                <ThreePLServicePage />
              </AuthWrapper>
            } />
            <Route path="/tracking" element={
              <AuthWrapper requireAuth>
                <TrackingPage />
              </AuthWrapper>
            } />
            <Route path="/compliance" element={
              <AuthWrapper requireAuth>
                <CompliancePage />
              </AuthWrapper>
            } />
            <Route path="/dashboard" element={
              <AuthWrapper requireAuth>
                <DashboardPage />
              </AuthWrapper>
            } />
            <Route path="/admin-dashboard" element={
              <AuthWrapper requireAuth requireAdmin>
                <AdminDashboardPage />
              </AuthWrapper>
            } />
            <Route path="/collaborate" element={
              <AuthWrapper requireAuth>
                <CollaboratePage />
              </AuthWrapper>
            } />
            <Route path="/support" element={
              <AuthWrapper requireAuth>
                <SupportPage />
              </AuthWrapper>
            } />
            <Route path="/integration" element={
              <AuthWrapper requireAuth>
                <IntegrationPage />
              </AuthWrapper>
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
