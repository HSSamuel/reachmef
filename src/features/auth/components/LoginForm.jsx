import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // ✅ Added useSearchParams
import { useAuthStore } from "../../../store/authStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Github,
  Command,
} from "lucide-react";
import { SEO } from "../../../components/seo/SEO";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Loading State
  const [loadingType, setLoadingType] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Added searchParams to catch URL tokens

  // ✅ FIX 1: Get 'user' and 'initializeAuth' from store
  const { login, signInWithSocial, user, initializeAuth } = useAuthStore();

  // ✅ FIX 2: Redirect if already logged in (Prevents stale session confusion)
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // ✅ FIX 3: Catch Social Login Token from URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Save the token from the backend redirect
      localStorage.setItem("reachme_token", token);
      
      // Tell the store to fetch the user profile with this new token
      initializeAuth(); 
      
      toast.success("Logged in successfully!");
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate, initializeAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingType("email");
    setError("");

    try {
      // ✅ 1. Attempt Login
      await login(email, password);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      // ✅ 2. Handle Invalid Credentials specifically
      if (err.message.includes("Invalid login credentials") || err.message.includes("Invalid Credentials")) {
        const msg = "Account not found or incorrect password.";
        setError(msg);
        toast.error(msg, { icon: "🚫" });
      } else {
        // Handle other errors (network, server, etc)
        const msg = err.message || "Failed to login. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      // ✅ 3. Always stop loading
      setLoadingType(null);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoadingType(provider);
    setError("");
    try {
      await signInWithSocial(provider);
    } catch (err) {
      console.error(err);
      const msg = `Could not connect to ${provider}. Please try again.`;
      setError(msg);
      toast.error(msg);
      setLoadingType(null);
    }
  };

  const isGlobalLoading = loadingType !== null;

  return (
    <>
      <SEO
        title="Login"
        description="Login to ReachMe"
        url={window.location.origin}
      />

      <div className="h-screen w-full flex bg-white font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900 overflow-hidden">
        {/* 1. LEFT SIDE: FORM */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col justify-center px-8 sm:px-12 md:px-24 xl:px-32 relative">
          {/* Logo (Top Left) */}
          <div className="absolute top-8 left-8 sm:left-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                R
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                ReachMe
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-48 sm:mt-24"
          >
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-3">
                Welcome back
              </h1>
              <p className="text-slate-500">
                Enter your details to access your dashboard.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isGlobalLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingType === "google" ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </>
                )}
              </button>

              {/* GITHUB BUTTON */}
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={isGlobalLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingType === "github" ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <Github size={20} />
                    <span>GitHub</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-slate-400 font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-slate-400 font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGlobalLoading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-lg hover:bg-zinc-800 focus:ring-4 focus:ring-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingType === "email" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign in"
                )}
                {loadingType !== "email" && <ArrowRight size={20} />}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                Create free account
              </Link>
            </p>
          </motion.div>

          <div className="relative mt-6 pb-10 text-center text-xs text-slate-400 lg:bottom-0 lg:left-0 lg:w-full lg:mt-5 lg:pb-0">
            © 2025 ReachMe
          </div>
        </div>

        {/* 3. RIGHT SIDE: IMAGE + GLASS CONTENT */}
        <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden items-end justify-end">
          <img
            src="/login-bg.png"
            alt="ReachMe creators"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 w-full max-w-[200px] mr-0 mb-0"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-10 pointer-events-none"></div>

              <div className="w-6 h-6 bg-white/90 rounded-lg flex items-center justify-center mb-2 shadow-lg relative z-10">
                <Command size={16} className="text-brand-900" />
              </div>

              <blockquote className="text-sm font-medium text-white leading-snug mb-3 relative z-10">
                "ReachMe has streamlined communication and collaboration
                entirely. The accessibility for my audience is seamless, and the
                design is impeccable."
              </blockquote>

              <div className="flex items-center justify-center gap-3 relative z-10 w-full">
                <img
                  src="sam.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full border border-white/50"
                />
                <div className="text-left">
                  <div className="text-white font-bold text-xs">Samuel</div>
                  <div className="text-white/60 text-[10px] font-medium tracking-wide">
                    @softwaredev_samuel
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}