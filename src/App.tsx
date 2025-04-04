
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LinksProvider } from "./contexts/LinksContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/onboarding/Onboarding";
import Dashboard from "./pages/dashboard/Dashboard";
import LinksManager from "./pages/dashboard/LinksManager";
import BioPageEditor from "./pages/dashboard/BioPageEditor";
import ScheduleContent from "./pages/dashboard/ScheduleContent";
import PublicProfile from "./pages/profile/PublicProfile";
import NotFound from "./pages/NotFound";

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
              <Route path="/:username" element={<PublicProfile />} />
              
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
                path="/dashboard/schedule" 
                element={
                  <ProtectedRoute>
                    <ScheduleContent />
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
