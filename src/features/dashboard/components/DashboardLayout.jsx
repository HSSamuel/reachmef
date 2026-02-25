import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useProfile } from "../../../hooks/useProfile";
import { api } from "../../../config/api";
import { QRCodeCanvas } from "qrcode.react";
import {
  LayoutDashboard,
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  Share2,
  Download,
  Copy,
  Check,
  Grid,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export function DashboardLayout() {
  const { signOut, user } = useAuthStore();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrAvatar, setQrAvatar] = useState(null);

  // Refs
  const profileRef = useRef(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const qrCodeRef = useRef(null);
  const downloadQrRef = useRef(null);

  useEffect(() => {
    const verifyUserExists = async () => {
      try {
        await api.get("/auth/me");
      } catch (error) {
        console.warn("User session invalid or user deleted by admin.");
        toast.error("Your session has expired or account was removed.", {
          id: "session-expired",
          icon: "🔒",
          duration: 5000,
        });
        await signOut();
        navigate("/login", { replace: true });
      }
    };
    verifyUserExists();
  }, [signOut, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (shareOpen && profile?.avatar_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = profile.avatar_url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL("image/png");
          setQrAvatar(dataURL);
        } catch (error) {
          setQrAvatar(null);
        }
      };

      img.onerror = () => {
        setQrAvatar(null);
      };
    }
  }, [shareOpen, profile?.avatar_url]);

  const cleanUsername = profile?.username ? profile.username.trim() : "";
  const profileUrl = cleanUsername
    ? `${window.location.origin}/${cleanUsername}`
    : window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!downloadQrRef.current) return;
    try {
      const canvas = downloadQrRef.current.querySelector("canvas");
      if (!canvas) throw new Error("QR Canvas not found");

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `reachme-qr-${cleanUsername || "profile"}-hd.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("High-quality QR downloaded!");
    } catch (error) {
      console.error("QR Download Error:", error);
      toast.error("Could not download QR Code.");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: LinkIcon, label: "Links", path: "/editor" },
    { icon: Palette, label: "Appearance", path: "/appearance" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: ShoppingBag, label: "Shop", path: "/shop" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const qrSettings = {
    value: profileUrl,
    bgColor: "#ffffff",
    fgColor: "#0f172a",
    level: "H",
    includeMargin: true,
    imageSettings: qrAvatar
      ? {
          src: qrAvatar,
          x: undefined,
          y: undefined,
          height: 45,
          width: 45,
          excavate: true,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-transparent">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Globe size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                ReachMe
              </span>
            </Link>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative hidden lg:block" ref={navRef}>
                <button
                  onClick={() => setNavOpen(!navOpen)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
                    ${
                      navOpen
                        ? "bg-slate-800 border-brand-500/50 text-white"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600"
                    }
                  `}
                >
                  <Grid size={18} />
                  <span className="text-sm font-medium">Menu</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      navOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {navOpen && (
                  <div className="absolute top-full right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-fade-in origin-top-right">
                    <div className="grid gap-1">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setNavOpen(false)}
                          end={item.path === "/dashboard"}
                          className={({ isActive }) => `
                              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                              ${
                                isActive
                                  ? "bg-brand-50 text-brand-600"
                                  : "text-slate-600 hover:bg-slate-50"
                              }
                            `}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/20 active:scale-95 border border-transparent"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-white/10 border border-transparent transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 shadow-sm">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-slate-400 hidden sm:block"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-fade-in z-50 origin-top-right">
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                    >
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.user_metadata?.full_name ||
                          profile?.username ||
                          "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-brand-600 font-medium mt-1.5 group-hover:underline">
                        Manage Account
                      </div>
                    </Link>

                    <div className="pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:hidden relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      mobileMenuOpen
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {mobileMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-fade-in z-50 origin-top-right">
                    <div className="grid gap-1">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          end={item.path === "/dashboard"}
                          className={({ isActive }) => `
                              flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                              ${
                                isActive
                                  ? "bg-brand-50 text-brand-600"
                                  : "text-slate-600 hover:bg-slate-50"
                              }
                            `}
                        >
                          <item.icon
                            size={18}
                            className={
                              window.location.pathname === item.path
                                ? "text-brand-600"
                                : "text-slate-400"
                            }
                          />
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {shareOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm relative transform transition-all scale-100">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Share your profile
              </h3>
              <p className="text-sm text-slate-500">
                Get more visitors by sharing your link.
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div
                ref={qrCodeRef}
                className="p-1 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <QRCodeCanvas {...qrSettings} size={240} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 truncate flex items-center">
                  {profileUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-slate-900 text-white px-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <button
                onClick={handleDownloadQR}
                className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                <Download size={18} />
                Download HD QR Code
              </button>
            </div>

            <div
              className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none"
              aria-hidden="true"
              ref={downloadQrRef}
            >
              <QRCodeCanvas
                {...qrSettings}
                size={2048} // ✨ Upgraded to massive 2K Resolution
                imageSettings={
                  qrSettings.imageSettings
                    ? {
                        ...qrSettings.imageSettings,
                        height: 360, // Scaled up logo size
                        width: 360,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto min-h-screen">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
