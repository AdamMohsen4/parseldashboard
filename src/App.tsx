
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import CompliancePage from './pages/CompliancePage';
import CollaboratePage from './pages/CollaboratePage';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import LabelPage from './pages/LabelPage';

function App() {
  React.useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="app dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/label" element={<LabelPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
