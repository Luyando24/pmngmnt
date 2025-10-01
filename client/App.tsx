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
import ScanQR from "./pages/ScanQR";
import FaceScanner from "./pages/FaceScanner";
import AdminDashboard from "./pages/AdminDashboard";
import AIAnalytics from "./pages/AIAnalytics";
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
              <Route path="/register" element={<Register />} />
              
              {/* Police Portal Routes */}
              <Route path="/police" element={<PoliceDashboard />} />
              <Route path="/police/cases" element={<CaseManagement />} />
              <Route path="/police/suspects" element={<SuspectRegistry />} />
              <Route path="/police/scan" element={<ScanQR />} />
              <Route path="/police/scan-qr" element={<ScanQR />} />
              <Route path="/police/face-scanner" element={<FaceScanner />} />
              <Route path="/police/analytics" element={<AIAnalytics />} />
              
              {/* Immigration Portal Routes */}
              <Route path="/immigration" element={<ImmigrationDashboard />} />
              <Route path="/immigration/visas" element={<VisaManagement />} />
              <Route path="/immigration/permits" element={<PermitManagement />} />
              <Route path="/immigration/passports" element={<PassportServices />} />
              <Route path="/immigration/residency" element={<ResidencyManagement />} />
              
              {/* Shared Services */}
              <Route path="/verification" element={<IdentityVerification />} />
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
