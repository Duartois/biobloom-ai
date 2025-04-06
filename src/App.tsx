
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { LinksProvider } from "./contexts/LinksContext";

// Pages
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import Onboarding from "./pages/onboarding/Onboarding";
import Dashboard from "./pages/dashboard/Dashboard";
import LinksManager from "./pages/dashboard/LinksManager";
import BioPageEditor from "./pages/dashboard/BioPageEditor";
import ScheduleContent from "./pages/dashboard/ScheduleContent";
import BackgroundGenerator from "./pages/dashboard/BackgroundGenerator";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import PublicProfile from "./pages/profile/[username]";
import NotFound from "./pages/NotFound";

// Pages em construção
import ComingSoon from "./pages/ComingSoon";

// Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LinksProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/:username" element={<PublicProfile />} />
              <Route path="/blog" element={<ComingSoon title="Blog" />} />
              <Route path="/help-center" element={<ComingSoon title="Central de Ajuda" />} />
              <Route path="/terms-of-service" element={<ComingSoon title="Termos de Serviço" />} />
              <Route path="/privacy-policy" element={<ComingSoon title="Política de Privacidade" />} />
              
              {/* Auth routes - accessible only to non-authenticated users */}
              <Route 
                path="/login" 
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                } 
              />
              <Route 
                path="/auth/confirm-email" 
                element={
                  <GuestRoute>
                    <ConfirmEmail />
                  </GuestRoute>
                } 
              />
              <Route path="/forgot-password" element={<ComingSoon title="Recuperação de Senha" />} />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/links" 
                element={
                  <ProtectedRoute>
                    <LinksManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/bio" 
                element={
                  <ProtectedRoute>
                    <BioPageEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/scheduled" 
                element={
                  <ProtectedRoute>
                    <ScheduleContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/background" 
                element={
                  <ProtectedRoute>
                    <BackgroundGenerator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LinksProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
