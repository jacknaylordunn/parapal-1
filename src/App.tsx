
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast-notification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EncounterProvider } from "./contexts/EncounterContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewEncounterPage from "./pages/NewEncounterPage";
import Guidelines from "./pages/Guidelines";
import Calculators from "./pages/Calculators";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import MainLayout from "./components/layout/MainLayout";
import EncounterLayout from "./components/layout/EncounterLayout";
import PatientPage from "./pages/encounter/PatientPage";
import VitalsPage from "./pages/encounter/VitalsPage";
import HistoryPage from "./pages/encounter/HistoryPage";
import GuidancePage from "./pages/encounter/GuidancePage";
import HandoverPage from "./pages/encounter/HandoverPage";

// Calculator pages
import NEWS2Calculator from "./pages/calculators/NEWS2Calculator";
import GCSCalculator from "./pages/calculators/GCSCalculator";
import DrugDosageCalculator from "./pages/calculators/DrugDosageCalculator";
import QRISKCalculator from "./pages/calculators/QRISKCalculator";
import BurnsCalculator from "./pages/calculators/BurnsCalculator";

// Guidelines pages
import GuidelineDetail from "./pages/guidelines/GuidelineDetail";

import { useEffect } from "react";
import { db, initializeDevData } from "./lib/db";

// Initialize query client
const queryClient = new QueryClient();

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

const App = () => {
  // Initialize database and session timeout
  useEffect(() => {
    // Check if app is installed as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    console.log(`Running as ${isPWA ? 'PWA' : 'browser tab'}`);
    
    // Initialize demo data in development
    if (process.env.NODE_ENV === 'development') {
      initializeDevData();
    }
    
    // Setup idle timeout
    let inactivityTimer: number;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        // PLACEHOLDER: In a real app with authentication, this would log the user out
        console.log('User inactive for 15 minutes. Session would be terminated.');
        alert('Your session has timed out due to inactivity.');
        // Placeholder for actual logout functionality
      }, SESSION_TIMEOUT);
    };
    
    // Events that reset the inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    // Start the timer
    resetInactivityTimer();
    
    return () => {
      // Clean up event listeners and timer
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <EncounterProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="new-encounter" element={<NewEncounterPage />} />
                    <Route path="guidelines" element={<Guidelines />} />
                    <Route path="guidelines/:categoryId/:guidelineId" element={<GuidelineDetail />} />
                    <Route path="calculators" element={<Calculators />} />
                    <Route path="calculators/news2" element={<NEWS2Calculator />} />
                    <Route path="calculators/gcs" element={<GCSCalculator />} />
                    <Route path="calculators/drug-dosage" element={<DrugDosageCalculator />} />
                    <Route path="calculators/qrisk" element={<QRISKCalculator />} />
                    <Route path="calculators/burns" element={<BurnsCalculator />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    
                    <Route path="encounter/:id" element={<EncounterLayout />}>
                      <Route path="patient" element={<PatientPage />} />
                      <Route path="vitals" element={<VitalsPage />} />
                      <Route path="history" element={<HistoryPage />} />
                      <Route path="guidance" element={<GuidancePage />} />
                      <Route path="handover" element={<HandoverPage />} />
                    </Route>
                  </Route>
                  {/* Catch all for 404s */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </EncounterProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
