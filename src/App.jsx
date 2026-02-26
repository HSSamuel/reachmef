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

// ✅ SMART LAZY LOAD WRAPPER: Catches "Failed to fetch dynamically imported module" errors
// and automatically reloads the page to get the latest chunks from Netlify.
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem("page-has-been-force-refreshed") || "false",
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem("page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assume the error is a stale chunk. Force refresh the page.
        window.sessionStorage.setItem("page-has-been-force-refreshed", "true");
        window.location.reload();
        return new Promise(() => {}); // Pause indefinitely while the page reloads
      }
      // If it still fails after a refresh, it's a genuine error. Throw it.
      throw error;
    }
  });

// ✅ Applied the wrapper to all lazy-loaded components
const DashboardLayout = lazyWithRetry(() =>
  import("./features/dashboard/components/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
const DashboardHome = lazyWithRetry(() =>
  import("./features/dashboard/components/DashboardHome").then((m) => ({
    default: m.DashboardHome,
  })),
);
const LinkEditor = lazyWithRetry(() =>
  import("./features/editor/components/LinkEditor").then((m) => ({
    default: m.LinkEditor,
  })),
);
const AppearanceEditor = lazyWithRetry(() =>
  import("./features/editor/components/AppearanceEditor").then((m) => ({
    default: m.AppearanceEditor,
  })),
);
const Analytics = lazyWithRetry(() =>
  import("./features/dashboard/components/Analytics").then((m) => ({
    default: m.Analytics,
  })),
);
const ShopManager = lazyWithRetry(() =>
  import("./features/shop/components/ShopManager").then((m) => ({
    default: m.ShopManager,
  })),
);
const Settings = lazyWithRetry(() =>
  import("./features/dashboard/components/Settings").then((m) => ({
    default: m.Settings,
  })),
);

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

          {/* 2. Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/editor" element={<LinkEditor />} />
            <Route path="/appearance" element={<AppearanceEditor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/shop" element={<ShopManager />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 3. Public Profile Route (Must be LAST) */}
          <Route path="/:username" element={<PublicProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
