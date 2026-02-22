import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// Components
import { PublicProfile } from "./features/public-profile/components/PublicProfile";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { DashboardLayout } from "./features/dashboard/components/DashboardLayout";
import { DashboardHome } from "./features/dashboard/components/DashboardHome";
import { LinkEditor } from "./features/editor/components/LinkEditor";
import { Analytics } from "./features/dashboard/components/Analytics";
import { ShopManager } from "./features/shop/components/ShopManager";
import { Settings } from "./features/dashboard/components/Settings";
import { LandingPage } from "./pages/LandingPage";
import { AppearanceEditor } from "./features/editor/components/AppearanceEditor";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
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
    </BrowserRouter>
  );
}
