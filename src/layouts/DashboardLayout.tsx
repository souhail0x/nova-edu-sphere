import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home, BookOpen, FileText, BarChart3, Heart, MessageSquare, Users, Calendar,
  Video, Settings, LogOut, Menu, X, Bell, Search, GraduationCap, Shield, UserCog, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const roleMenus = {
  student: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Courses", icon: BookOpen, path: "/dashboard/courses" },
    { label: "Exams & Quizzes", icon: FileText, path: "/dashboard/exams" },
    { label: "Favorites", icon: Heart, path: "/dashboard/favorites" },
    { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { label: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { label: "Community", icon: Users, path: "/dashboard/community" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { label: "Live Class", icon: Video, path: "/dashboard/stream" },
  ],
  teacher: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/dashboard/courses" },
    { label: "Exams & Quizzes", icon: FileText, path: "/dashboard/exams" },
    { label: "Student Analytics", icon: BarChart3, path: "/dashboard/teacher-analytics" },
    { label: "Questions", icon: MessageSquare, path: "/dashboard/questions" },
    { label: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { label: "Live Class", icon: Video, path: "/dashboard/stream" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
  ],
  moderator: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Communities", icon: Users, path: "/dashboard/community" },
    { label: "Students", icon: GraduationCap, path: "/dashboard/students" },
    { label: "Announcements", icon: Bell, path: "/dashboard/announcements" },
    { label: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
  ],
  admin: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Users", icon: UserCog, path: "/dashboard/users" },
    { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ],
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;
  const menu = roleMenus[user.role as keyof typeof roleMenus] || roleMenus.student;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-accent" />
            <span className="font-heading font-bold text-lg">IGA Learn</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-primary-foreground/70 hover:text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-accent"
                    : "text-primary-foreground/70 hover:bg-sidebar-accent hover:text-primary-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary-foreground/70 hover:bg-sidebar-accent hover:text-primary-foreground w-full transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 w-72 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-background transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 z-50"
                  >
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors">
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
