import "./global.css";
import "./styles/card-animations.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthLogin from "./pages/AuthLogin";
import StaffLogin from "./pages/StaffLogin";
import PoliceDashboard from "./pages/PoliceDashboard";
import ImmigrationDashboard from "./pages/ImmigrationDashboard";
import CaseManagement from "./pages/CaseManagement";
import SuspectRegistry from "./pages/SuspectRegistry";
import VisaManagement from "./pages/VisaManagement";
import PermitManagement from "./pages/PermitManagement";
import IdentityVerification from "./pages/IdentityVerification";
import PassportServices from "./pages/PassportServices";
import ResidencyManagement from "./pages/ResidencyManagement";
import Register from "./pages/Register";
import StaffRegister from "./pages/StaffRegister";
import CitizenDashboard from "./pages/CitizenDashboard";
import ScanQR from "./pages/ScanQR";
import FaceScanner from "./pages/FaceScanner";
import AdminDashboard from "./pages/AdminDashboard";
import AIAnalytics from "./pages/AIAnalytics";
import PatrolManagement from "./pages/PatrolManagement";
import ShiftManagement from "./pages/ShiftManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import FingerprintApplication from "./pages/FingerprintApplication";
import LostDocumentReport from "./pages/LostDocumentReport";
import ReportCase from "./pages/ReportCase";
import BackgroundCheck from "./pages/BackgroundCheck";
import EmergencyServices from "./pages/EmergencyServices";
import ApplicationTracking from "./pages/ApplicationTracking";
import NRCApplication from "./pages/NRCApplication";
import PassportApplication from "./pages/PassportApplication";
import BirthCertificateApplication from "./pages/BirthCertificateApplication";
import DeathCertificateApplication from "./pages/DeathCertificateApplication";
import MyPhotoID from "./pages/MyPhotoID";
import CitizenSettings from "./pages/CitizenSettings";
import { useEffect } from "react";
import { syncService } from "@/lib/sync";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    syncService.start();
    return () => syncService.stop();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthLogin />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/staff-register" element={<StaffRegister />} />

              {/* Citizen Portal Routes */}
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/settings" element={<CitizenSettings />} />
              <Route path="/services/report-case" element={<ReportCase />} />
              <Route path="/services/background-check" element={<BackgroundCheck />} />
              <Route path="/services/emergency" element={<EmergencyServices />} />
              <Route path="/services/applications" element={<ApplicationTracking />} />
              <Route path="/services/nrc" element={<NRCApplication />} />
              <Route path="/services/passport" element={<PassportApplication />} />
              <Route path="/services/birth-certificate" element={<BirthCertificateApplication />} />
              <Route path="/services/death-certificate" element={<DeathCertificateApplication />} />
              <Route path="/citizen/photo-id" element={<MyPhotoID />} />

              {/* Police Portal Routes */}
              <Route path="/dashboard/police" element={<PoliceDashboard />} />
              <Route path="/dashboard/police/cases" element={<CaseManagement />} />
              <Route path="/dashboard/police/suspects" element={<SuspectRegistry />} />
              <Route path="/dashboard/police/scan" element={<ScanQR />} />
              <Route path="/dashboard/police/scan-qr" element={<ScanQR />} />
              <Route path="/dashboard/police/face-scanner" element={<FaceScanner />} />
              <Route path="/dashboard/police/analytics" element={<AIAnalytics />} />
              <Route path="/dashboard/police/patrols" element={<PatrolManagement />} />
              <Route path="/dashboard/police/shifts" element={<ShiftManagement />} />
              <Route path="/dashboard/police/reports" element={<Reports />} />
              <Route path="/dashboard/police/settings" element={<Settings />} />

              {/* Immigration Portal Routes */}
              <Route path="/immigration" element={<ImmigrationDashboard />} />
              <Route path="/immigration/visas" element={<VisaManagement />} />
              <Route path="/immigration/permits" element={<PermitManagement />} />
              <Route path="/immigration/passports" element={<PassportServices />} />
              <Route path="/immigration/residency" element={<ResidencyManagement />} />

              {/* Shared Services */}
              <Route path="/verification" element={<IdentityVerification />} />
              <Route path="/services/fingerprint" element={<FingerprintApplication />} />
              <Route path="/services/lost-documents" element={<LostDocumentReport />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Legacy redirect routes for backward compatibility */}
              <Route path="/dashboard" element={<PoliceDashboard />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
