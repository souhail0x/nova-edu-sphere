import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Exams from "@/pages/Exams";
import Favorites from "@/pages/Favorites";
import Analytics from "@/pages/Analytics";
import CalendarPage from "@/pages/CalendarPage";
import Community from "@/pages/Community";
import Messages from "@/pages/Messages";
import Stream from "@/pages/Stream";
import UsersPage from "@/pages/UsersPage";
import TeacherAnalytics from "@/pages/TeacherAnalytics";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="/dashboard/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
      <Route path="/dashboard/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/dashboard/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
      <Route path="/dashboard/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/dashboard/stream" element={<ProtectedRoute><Stream /></ProtectedRoute>} />
      <Route path="/dashboard/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/dashboard/students" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/dashboard/teacher-analytics" element={<ProtectedRoute><TeacherAnalytics /></ProtectedRoute>} />
      <Route path="/dashboard/questions" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/dashboard/announcements" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
