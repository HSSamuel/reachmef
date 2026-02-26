import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  PenTool,
  Palette,
  BarChart3,
  ShoppingBag,
  Settings,
  Share2,
  Check,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Navbar() {
  const { user, signOut } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ MONGODB FIX: Fallback to email prefix if username isn't available at root level
  const userIdentifier = user?.email?.split("@")[0] || "user";
  const copyLink = () => {
    // ✅ Append a tiny timestamp cache-buster so WhatsApp is forced to fetch live updates
    const v = new Date().getTime().toString().slice(-5);
    const url = `${window.location.origin}/${userIdentifier}?v=${v}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: "/dashboard",
      exact: true,
    },
    { icon: PenTool, label: "Editor", href: "/dashboard/editor" },
    { icon: Palette, label: "Appearance", href: "/dashboard/appearance" },
    { icon: ShoppingBag, label: "Shop", href: "/dashboard/shop" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 1. LEFT: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 hidden md:block">
              ReachMe
            </span>
          </div>

          {/* 2. CENTER: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                  )
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* 3. RIGHT: Share & User */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-full text-sm font-bold transition-colors"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span className="hidden sm:inline">
                {copied ? "Copied" : "Share"}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium",
                    isActive
                      ? "bg-slate-50 text-brand-600"
                      : "text-slate-600 hover:bg-slate-50",
                  )
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
