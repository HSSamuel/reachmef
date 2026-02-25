import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Loader2 } from "lucide-react";

// Components - Eagerly loaded for instant first paint
import { PublicProfile } from "./features/public-profile/components/PublicProfile";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { LandingPage } from "./pages/LandingPage";

// ✅ PERFORMANCE FIX: Lazy load heavy protected components to reduce initial bundle size
const DashboardLayout = lazy(() => import("./features/dashboard/components/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import("./features/dashboard/components/DashboardHome").then(m => ({ default: m.DashboardHome })));
const LinkEditor = lazy(() => import("./features/editor/components/LinkEditor").then(m => ({ default: m.LinkEditor })));
const AppearanceEditor = lazy(() => import("./features/editor/components/AppearanceEditor").then(m => ({ default: m.AppearanceEditor })));
const Analytics = lazy(() => import("./features/dashboard/components/Analytics").then(m => ({ default: m.Analytics })));
const ShopManager = lazy(() => import("./features/shop/components/ShopManager").then(m => ({ default: m.ShopManager })));
const Settings = lazy(() => import("./features/dashboard/components/Settings").then(m => ({ default: m.Settings })));

// Fallback UI for Suspense boundaries
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
  </div>
);

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 1. Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* 2. Protected Dashboard Routes 
              ✅ FIX: We use a Layout Route (no 'path' prop) to wrap these pages.
              This allows paths like '/appearance' to work at the root level 
              while still being protected by the DashboardLayout.
          */}
          <Route element={<DashboardLayout />}>
            {/* Main Dashboard view */}
            <Route path="/dashboard" element={<DashboardHome />} />

            {/* These now match the links in your DashboardHome (e.g., to="/appearance") */}
            <Route path="/editor" element={<LinkEditor />} />
            <Route path="/appearance" element={<AppearanceEditor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/shop" element={<ShopManager />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 3. Public Profile Route (Must be LAST) 
              Any route not matched above falls through to here.
          */}
          <Route path="/:username" element={<PublicProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}