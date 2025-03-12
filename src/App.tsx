
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkLoaded, useUser } from "@clerk/clerk-react";
import AuthWrapper from "./components/auth/AuthWrapper";
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";

// Lazy load less frequently used pages
const ShipmentBookingPage = lazy(() => import("./pages/ShipmentBookingPage"));
const ThreePLServicePage = lazy(() => import("./pages/ThreePLServicePage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const CompliancePage = lazy(() => import("./pages/CompliancePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CollaboratePage = lazy(() => import("./pages/CollaboratePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const IntegrationPage = lazy(() => import("./pages/IntegrationPage"));
const TransportationPartnersPage = lazy(() => import("./pages/TransportationPartnersPage"));
const ShipmentsPage = lazy(() => import("./pages/ShipmentsPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="">
        <ClerkLoaded>
          <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/transportation-partners" element={
                <AuthWrapper requireAuth>
                  <TransportationPartnersPage />
                </AuthWrapper>
              } />
              <Route path="/dashboard" element={
                <AuthWrapper requireAuth>
                  <DashboardPage />
                </AuthWrapper>
              } />
              <Route path="/shipments" element={
                <AuthWrapper requireAuth>
                  <ShipmentsPage />
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
          </Suspense>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
