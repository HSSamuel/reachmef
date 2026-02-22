import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Palette,
  BarChart3,
  ShoppingBag,
  Layers,
  Globe,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Star,
  Share2,
  Layout,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowUp,
} from "lucide-react";
import { SEO } from "../components/seo/SEO";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const brands = [
  {
    name: "Spotify",
    path: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  },
  {
    name: "Twitch",
    path: "M2.149 0l-1.612 4.119v16.736h4.757v3.309h3.23l3.029-3.309h4.653l6.947-6.944V0H2.149zm19.164 13.054l-4.12 4.12h-4.276l-3.03 3.028v-3.028H5.289V1.654h16.025v11.4zm-10.02-3.132V4.547h2.204v5.375h-2.204zm5.508 0V4.547h2.205v5.375h-2.205z",
  },
  {
    name: "TikTok",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-1.61 2.3-1.2 5.4.94 7.24 1.1 1.01 2.73 1.45 4.24 1.15v4.24c-1.72.33-3.53.27-5.22-.38-2.67-1.04-4.72-3.32-5.32-6.11-.6-2.79.03-5.73 1.95-7.98-2.31.25-4.7.16-7.01.16-.07-2.61-.03-5.23-.03-7.84.03-1.65 1.02-3.19 2.53-3.88 1.51-.7 3.28-.56 4.67.36 1.4 1 2.19 2.71 2.06 4.39-.02 1.9-.02 3.8-.02 5.71 0 1.25.17 2.66 1.03 3.63.85.99 2.2 1.39 3.42 1.02 1.21-.36 2.15-1.43 2.32-2.68.22-1.56-.24-3.17-1.32-4.32-1.07-1.17-2.7-1.77-4.27-1.57V.02h-.03z",
  },
  {
    name: "Medium",
    path: "M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z",
  },
  {
    name: "Substack",
    path: "M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z",
  },
];

export function LandingPage() {
  const { session } = useAuthStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollY = useRef(0);

  // ✅ Interactive Demo State
  const [demoUsername, setDemoUsername] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 50 &&
        !isMobileMenuOpen
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setShowBackToTop(currentScrollY > 400);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClaim = () => {
    if (demoUsername) {
      navigate(`/register?username=${demoUsername}`);
    }
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#works" },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="The only link you'll ever need. Connect your audience to all of your content with just one URL."
        url={window.location.origin}
      />

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={scrollToTop}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Globe size={20} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
              ReachMe
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <Link
                  to="/dashboard"
                  className="font-bold text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-bold text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="relative group font-bold text-sm bg-slate-900 text-white px-6 py-2.5 rounded-full transition-all hover:scale-105 overflow-hidden shadow-lg"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[70px] inset-x-4 z-40 bg-white/95 backdrop-blur-2xl border border-slate-200/50 rounded-2xl p-6 md:hidden shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 py-3 px-2 border-b border-slate-100 hover:bg-slate-50 hover:text-indigo-600 transition-colors rounded-lg flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                  />
                </a>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                {session ? (
                  <Link
                    to="/dashboard"
                    className="w-full justify-center font-bold text-lg bg-slate-900 text-white px-4 py-3.5 rounded-xl flex items-center gap-2 shadow-xl shadow-slate-900/10"
                  >
                    Dashboard <ChevronRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full justify-center font-bold text-lg border-2 border-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full justify-center font-bold text-lg bg-indigo-600 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      Get Started Free <ChevronRight size={18} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
        {/* --- HERO SECTION --- */}
        <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center relative z-10">
            {/* Left: Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 hover:bg-indigo-100 transition-colors cursor-default shadow-sm">
                  <Zap size={14} className="fill-indigo-700" />
                  v2.0 is Live
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 tracking-tight text-slate-900"
              >
                Your Digital Identity, <br />
                {/* ✅ TYPEWRITER IS USED HERE */}
                <Typewriter
                  text="All in One Link."
                  className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_auto]"
                  speed={150}
                  pause={2000}
                />
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg"
              >
                Join 10,000+ creators using ReachMe to share content, sell
                products, and grow their audience.
              </motion.p>

              {/* ✅ INTERACTIVE HERO INPUT */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-8"
              >
                <div className="relative flex-1 group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg group-focus-within:text-indigo-600 transition-colors">
                    reach.me/
                  </span>
                  <input
                    type="text"
                    value={demoUsername}
                    onChange={(e) =>
                      setDemoUsername(
                        e.target.value.replace(/\s+/g, "").toLowerCase()
                      )
                    }
                    placeholder="yourname"
                    className="w-full pl-28 pr-4 py-4 bg-white border-2 border-slate-200 rounded-full outline-none focus:border-indigo-500 font-bold text-lg text-slate-800 shadow-sm transition-all"
                  />
                </div>
                <button
                  onClick={handleClaim}
                  className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 whitespace-nowrap"
                >
                  Claim Link
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${
                          i + 10
                        })`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <p>
                  Trusted by{" "}
                  <span className="text-slate-900 font-bold">10,000+</span>{" "}
                  creators
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] -z-10 transform translate-y-20"></div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="w-[320px] h-[640px] mx-auto bg-slate-900 rounded-[3rem] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-white/10 rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                  {/* Screen Content */}
                  <div className="w-full h-full bg-slate-50 overflow-hidden flex flex-col items-center pt-14 px-5 relative">
                    <div className="w-full absolute top-0 left-0 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-b-[2.5rem]"></div>

                    <div className="z-10 w-24 h-24 bg-white p-1 rounded-full mb-2 shadow-lg mt-4">
                      {/* ✅ DYNAMIC AVATAR based on demoUsername */}
                      <img
                        src={
                          demoUsername
                            ? `https://api.dicebear.com/7.x/initials/svg?seed=${demoUsername}`
                            : "sam.jpg"
                        }
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <div className="z-10 text-center mb-5">
                      {/* ✅ DYNAMIC TEXT */}
                      <h3 className="font-bold text-slate-900 text-lg transition-all">
                        {demoUsername ? `@${demoUsername}` : "HSSamuel"}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {demoUsername
                          ? "Creator | Entrepreneur"
                          : "Graphic Designer 🎨 | Tech Enthusiast 💻"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-5 z-10 text-slate-400">
                      <Instagram
                        size={18}
                        className="hover:text-pink-600 transition-colors"
                      />
                      <Twitter
                        size={18}
                        className="hover:text-blue-400 transition-colors"
                      />
                      <Linkedin
                        size={18}
                        className="hover:text-blue-700 transition-colors"
                      />
                      <Globe
                        size={18}
                        className="hover:text-slate-600 transition-colors"
                      />
                    </div>

                    <div className="w-full space-y-2.5 z-10 px-1">
                      <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                          <Youtube size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs">
                          Latest Video
                        </span>
                        <ChevronRight
                          size={16}
                          className="ml-auto text-slate-300"
                        />
                      </div>

                      <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                          <Layers size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs">
                          My Portfolio
                        </span>
                        <ChevronRight
                          size={16}
                          className="ml-auto text-slate-300"
                        />
                      </div>

                      <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-green-50 text-green-500 rounded-lg flex items-center justify-center">
                          <ShoppingBag size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs">
                          Shop Presets
                        </span>
                        <div className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          20% OFF
                        </div>
                      </div>

                      <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3 gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
                          <Mail size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs">
                          Join Newsletter
                        </span>
                        <ChevronRight
                          size={16}
                          className="ml-auto text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-20 -right-8 bg-white p-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow z-20">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <BarChart3 size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          Clicks
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          12.5k
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* --- LOGO CLOUD --- */}
        <section className="py-10 border-y border-slate-100 bg-slate-50/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Powering next-gen creators
            </p>
          </div>

          <div className="relative flex overflow-hidden group">
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

            <motion.div
              className="flex gap-16 items-center flex-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25,
              }}
            >
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex items-center gap-2 group/item cursor-pointer min-w-[120px]"
                >
                  <div className="w-8 h-8 text-slate-400 group-hover/item:text-slate-900 transition-colors duration-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d={brand.path} />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-slate-400 group-hover/item:text-slate-900 transition-colors duration-300">
                    {brand.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="works" className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Go from zero to launch in minutes.
              </h2>
              <p className="text-xl text-slate-500">
                No design skills or coding required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: Layout,
                  title: "1. Claim your link",
                  desc: "Choose your unique username and claim your corner of the internet.",
                },
                {
                  icon: Palette,
                  title: "2. Customize",
                  desc: "Pick a theme, add your socials, and design it to match your brand.",
                },
                {
                  icon: Share2,
                  title: "3. Share everywhere",
                  desc: "Generate a custom QR code for your business cards, presentation slides, and marketing materials to connect instantly.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  {idx !== 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Everything you need to grow.
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed">
                ReachMe gives you the tools to connect, sell, and grow your
                audience from one simple link.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Palette,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                  title: "Custom Appearance",
                  desc: "Match your brand perfectly. Choose from themes, custom fonts, and animated backgrounds.",
                  list: ["Custom Hex Colors", "Button Animations"],
                },
                {
                  icon: BarChart3,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  title: "Deep Analytics",
                  desc: "Track your views, clicks, and CTR with beautiful charts. Understand what your audience loves.",
                  list: ["Real-time data", "Location tracking"],
                },
                {
                  icon: ShoppingBag,
                  color: "text-green-600",
                  bg: "bg-green-50",
                  title: "Sell Products",
                  desc: "Showcase your eBooks, courses, or merchandise directly on your profile with our Shop grid.",
                  list: ["0% Transaction Fees", "Instant Payouts"],
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon size={28} className={feature.color} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <ul className="space-y-2">
                    {feature.list.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 size={16} className="text-indigo-500" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px]"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 tracking-tight">
              Ready to claim your link?
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of creators who use ReachMe to share more, sell
              more, and grow more.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-indigo-500 transition-all hover:scale-105 shadow-2xl shadow-indigo-500/50"
              >
                Get Started for Free <ArrowRight />
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
              <p>© 2025 ReachMe. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* BACK TO TOP */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-3 right-3 z-50 p-3 bg-slate-700 text-white rounded-full shadow-xl hover:bg-indigo-600 transition-colors"
            >
              <ArrowUp size={10} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ✅ Typewriter Component (Added at the bottom to fix ReferenceError)
function Typewriter({ text, className, speed = 150, pause = 2000 }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && displayText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, speed / 2);
    } else if (!isDeleting && displayText.length === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text, speed, pause]);

  return (
    <span className="inline-block">
      <span className={className}>{displayText}</span>
      <span className="animate-pulse ml-0.5 text-indigo-600">|</span>
    </span>
  );
}
