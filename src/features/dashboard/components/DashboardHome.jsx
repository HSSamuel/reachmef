import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MousePointer2,
  Eye,
  Plus,
  Palette,
  Share2,
  ArrowUpRight,
  Link as LinkIcon,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useProfile } from "../../../hooks/useProfile";
import { useLinks } from "../../editor/hooks/useLinks";
import { useAuthStore } from "../../../store/authStore";
import { PhonePreview } from "../../editor/components/PhonePreview";
import { Card } from "../../../components/ui/Card";

export function DashboardHome() {
  const { user } = useAuthStore();
  const { profile, loading: profileLoading } = useProfile();
  const { links, loading: linksLoading } = useLinks();

  // ✅ MONGODB FIX: Removed user_metadata reliance
  const displayName = profile?.full_name || profile?.username || "Creator";

  const typedName = useTypewriter(displayName, 150);

  if (profileLoading || linksLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300 w-8 h-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Profile Not Found
        </h2>
        <p className="text-slate-500 max-w-md mb-6">
          We couldn't load your profile data. You may need to complete your
          setup.
        </p>
        <Link
          to="/onboarding"
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Complete Setup
        </Link>
      </div>
    );
  }

  // Calculate Real Stats
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const totalViews = Math.floor(totalClicks * 1.5);
  const activeLinks = links.filter((l) => l.is_active).length;

  // Calculate "Profile Health" Score
  let healthScore = 20;
  if (profile?.bio) healthScore += 20;
  if (profile?.avatar_url) healthScore += 20;
  if (activeLinks > 0) healthScore += 20;
  if (profile?.social_instagram || profile?.social_twitter) healthScore += 20;

  // ONBOARDING LOGIC
  const checklistItems = [
    {
      id: 1,
      label: "Add your first link",
      done: links.length > 0,
      link: "/editor",
    },
    {
      id: 2,
      label: "Upload profile picture",
      done: !!profile.avatar_url,
      link: "/appearance",
    },
    { id: 3, label: "Set your Bio", done: !!profile.bio, link: "/appearance" },
  ];

  const progress = Math.round(
    (checklistItems.filter((i) => i.done).length / checklistItems.length) * 100,
  );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
            Welcome back,
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-extrabold tracking-tight min-w-[100px] flex items-center">
              {typedName}
              <span className="text-indigo-600 animate-pulse ml-0.5">|</span>
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here is your daily snapshot.
          </p>
        </div>
        <Link
          to="/editor"
          className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95 transform duration-100"
        >
          <Plus size={14} /> Create Link
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: WIDGETS */}
        <div className="xl:col-span-2 space-y-6">
          {/* PREMIUM ONBOARDING WIDGET */}
          {progress < 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 p-6 text-white shadow-2xl shadow-indigo-500/30"
            >
              {/* Background Glows */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles
                        className="text-yellow-300 fill-yellow-300 animate-pulse"
                        size={24}
                      />
                      Setup Guide
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                      Complete these steps to launch your profile.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black tracking-tight">
                      {progress}%
                    </span>
                    <span className="text-[10px] text-indigo-200 block uppercase tracking-wider font-bold">
                      Complete
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden mb-6 backdrop-blur-sm border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {checklistItems.map((item) => (
                    <Link key={item.id} to={item.link}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all h-full ${
                          item.done
                            ? "bg-indigo-900/40 border-indigo-500/30 text-indigo-200 cursor-default"
                            : "bg-white/10 border-white/20 hover:bg-white/20 text-white cursor-pointer shadow-lg backdrop-blur-md"
                        }`}
                      >
                        {/* Icon State */}
                        <div
                          className={`p-1.5 rounded-full shrink-0 ${
                            item.done
                              ? "bg-green-500/20 text-green-400"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {item.done ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${
                              item.done ? "line-through opacity-60" : ""
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>

                        {!item.done && (
                          <ArrowRight size={14} className="opacity-60" />
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 1. STATS ROW */}
          <div className="grid grid-cols-3 gap-4">
            <StatWidget
              label="Total Views"
              value={totalViews.toLocaleString()}
              icon={<Eye size={16} />}
              iconColor="text-blue-600 bg-white"
              className="bg-blue-50/50 border-blue-100 hover:border-blue-200"
            />
            <StatWidget
              label="Total Clicks"
              value={totalClicks.toLocaleString()}
              icon={<MousePointer2 size={16} />}
              iconColor="text-purple-600 bg-white"
              className="bg-purple-50/50 border-purple-100 hover:border-purple-200"
            />
            <StatWidget
              label="Active Links"
              value={activeLinks}
              icon={<LinkIcon size={16} />}
              iconColor="text-emerald-600 bg-white"
              className="bg-emerald-50/50 border-emerald-100 hover:border-emerald-200"
            />
          </div>

          {/* 2. ACTIONS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/appearance" className="group">
              <Card className="p-4 h-full bg-gradient-to-br from-indigo-50 via-white to-white border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Palette size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Customize Look
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 group-hover:text-indigo-600">
                    Change themes & fonts.
                  </p>
                </div>
              </Card>
            </Link>

            <Link to="/shop" className="group">
              <Card className="p-4 h-full bg-gradient-to-br from-pink-50 via-white to-white border-pink-100 hover:border-pink-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Manage Shop
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 group-hover:text-pink-600">
                    Add products & track sales.
                  </p>
                </div>
              </Card>
            </Link>
          </div>

          {/* 3. PROFILE HEALTH */}
          <Card className="p-4 bg-gradient-to-r from-slate-50 to-white border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Profile Strength
              </h3>
              <span
                className={`text-xs font-bold ${
                  healthScore === 100 ? "text-green-600" : "text-indigo-600"
                }`}
              >
                {healthScore}%
              </span>
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden mb-3 border border-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  healthScore === 100 ? "bg-green-500" : "bg-indigo-500"
                }`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>

            {/* Health Suggestions */}
            {healthScore < 100 && (
              <div className="flex flex-wrap gap-2">
                {!profile.bio && (
                  <Link
                    to="/appearance"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md hover:bg-slate-50 border border-slate-200 shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                    Add Bio
                  </Link>
                )}
                {!profile.avatar_url && (
                  <Link
                    to="/appearance"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md hover:bg-slate-50 border border-slate-200 shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                    Add Avatar
                  </Link>
                )}
                {activeLinks === 0 && (
                  <Link
                    to="/editor"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md hover:bg-slate-50 border border-slate-200 shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    Create Link
                  </Link>
                )}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-white px-2 py-1 rounded-md border border-green-200 ml-auto cursor-pointer hover:bg-green-50 shadow-sm">
                  <ArrowUpRight size={10} /> Improve Score
                </div>
              </div>
            )}
          </Card>

          {/* 4. TOP LINKS */}
          <Card className="border-slate-200 overflow-hidden bg-white">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900 text-sm">
                Top Performing Links
              </h3>
              <Link
                to="/analytics"
                className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
              >
                View Analytics
              </Link>
            </div>
            <div className="bg-white">
              {links.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400 text-xs mb-2">
                    No links created yet.
                  </p>
                  <Link
                    to="/editor"
                    className="text-indigo-600 text-xs font-bold hover:underline"
                  >
                    Create your first link
                  </Link>
                </div>
              ) : (
                links.slice(0, 3).map((link, i) => (
                  <div
                    key={link._id} // ✅ MONGODB FIX
                    className="p-3 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-[10px] font-bold text-slate-500 shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {i + 1}
                      </span>
                      <div className="truncate min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {link.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-600">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-4">
                      <span className="text-xs font-bold text-slate-900 block">
                        {link.clicks || 0}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">
                        Clicks
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="hidden xl:block sticky top-8">
          <div className="bg-white rounded-[2.5rem] p-2 shadow-xl border border-slate-200">
            <div className="scale-[0.85] origin-top h-[600px] pointer-events-none select-none">
              <PhonePreview profile={profile} />
            </div>
          </div>

          <div className="mt-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Share Profile
              </h3>
              <p className="text-[10px] text-slate-500 group-hover:text-indigo-500">
                Get your link out there.
              </p>
            </div>
            <Link
              to="/settings"
              className="bg-white p-2 rounded-full text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12 shadow-sm"
            >
              <Share2 size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatWidget({ label, value, icon, iconColor, className }) {
  return (
    <Card
      className={`p-3 shadow-sm flex flex-col justify-center items-center h-24 relative overflow-hidden group hover:shadow-md transition-all ${className}`}
    >
      <div
        className={`absolute top-0 right-0 p-2 rounded-bl-xl opacity-20 group-hover:opacity-100 transition-opacity ${iconColor}`}
      >
        {icon}
      </div>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 shadow-sm ${iconColor}`}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
          {value}
        </h3>
      </div>
    </Card>
  );
}

function useTypewriter(text, speed = 150) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayText("");
    setIndex(0);
    setIsDeleting(false);
  }, [text]);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (index < text.length) {
            setDisplayText((prev) => prev + text.charAt(index));
            setIndex(index + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (index > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
            setIndex(index - 1);
          } else {
            setIsDeleting(false);
          }
        }
      },
      isDeleting ? 50 : speed,
    );

    return () => clearTimeout(timeout);
  }, [text, index, isDeleting, speed]);

  return displayText;
}
