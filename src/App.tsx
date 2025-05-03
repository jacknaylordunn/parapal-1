
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast-notification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EncounterProvider } from "./contexts/EncounterContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewEncounterPage from "./pages/NewEncounterPage";
import Guidelines from "./pages/Guidelines";
import Calculators from "./pages/Calculators";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Auth Pages
import SignInPage from "./pages/auth/SignInPage";

// Organization Pages
import OrganizationPage from "./pages/organizations/OrganizationPage";

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

// Protected route component that redirects to signin if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // While checking auth status, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nhs-blue"></div>
    </div>;
  }
  
  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }
  
  return children;
};

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
    
    // Apply viewport meta tag for better mobile display
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    // Add touch action for better iOS behavior
    document.documentElement.style.touchAction = 'manipulation';
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <EncounterProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Auth Routes - accessible without authentication */}
                    <Route path="/auth/signin" element={<SignInPage />} />
                    
                    {/* Main App Routes - protected */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }>
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
                      
                      {/* Organization Routes */}
                      <Route path="organizations" element={<OrganizationPage />} />
                      
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
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
